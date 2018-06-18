import React, { Component } from 'react';
// import { Popover, PopoverBody } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MessageList, ChatList, Input } from 'react-chat-elements';
import md5 from 'md5';
import moment from 'moment';
import Identicon from 'identicon.js';
import firebase from 'firebase/app';
import { validateCallback } from '@firebase/util';
import 'firebase/database';
import 'firebase/auth';
// import TransferCoin from '@/components/Wallet/TransferCoin';
import Modal from '@/components/core/controls/Modal';

import { setHeaderLeft, setHeaderTitle } from '@/reducers/app/action';
import IconBtnSend from '@/assets/images/icon/ic-btn-send.svg';
import IconBackBtn from '@/assets/images/icon/back-chevron.svg';
import IconAvatar from '@/assets/images/icon/avatar.svg';

import { Firechat } from './Firechat';
import './Firechat.scss';
import './Chat.scss';

// Get a reference to the Firebase Realtime Database
const chatRef = firebase.database().ref('chat');
let isInitialized = false;

// Create an instance of Firechat
export const chatInstance = new Firechat(firebase, chatRef);

class Chat extends Component {
  constructor(props) {
    super(props);

    this.coinTextRegEx = /([-+]?[0-9]*\.?[0-9]+)\s*?(ETHEREUM|BITCOIN|ETHER|ETH|BTC)/gi;
    this.htmlTagRegEx = /<\/?[\w\s="/.':;#-\/\?]+>/gi;
    this.specialTags = ['transfer_coin'];
    this.user = null;

    this.state = {
      chatSource: {},
      chatDetail: null,
      currentMessage: '',
      searchUserString: '',
      searchUsers: [],
      tooltipTarget: '',
      transferCoin: {},
    };

    this.chatInputRef = React.createRef();
    this.messageListRef = null;
    this.searchBtnRef = null;
    this.modalRef = null;
    this.maxUserSearchResult = null;
    this.isInChatTab = true;

    this.renderChatList = this.renderChatList.bind(this);
    this.renderChatDetail = this.renderChatDetail.bind(this);
    this.onChatItemClicked = this.onChatItemClicked.bind(this);
    this.onSearchUserClicked = this.onSearchUserClicked.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onSearchUser = this.onSearchUser.bind(this);
    this.onBackButtonClicked = this.onBackButtonClicked.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);

    this.chatTo = props.match.params.username;

    this.bindDataEvents();
    this.signIn(null);
  }

  componentDidMount() {
    this.updateHeaderLeft();
  }

  componentWillUnmount() {
    this.isInChatTab = false;
  }

  onBackButtonClicked() {
    this.setCustomState({
      chatDetail: null,
    }, () => {
      this.updateHeaderLeft();
    });
    this.setCurrentUserName();
  }

  onUpdateUser(user) {
    // Update our current user state and render latest user name.
    console.log('update user', user);
    this.user = user;
    if (!this.state.chatDetail) {
      this.setCurrentUserName();
    }
  }

  onEnterRoom(room) {
    console.log('enter room', room);
    const { id: roomId, authorizedUsers } = room;
    const { chatSource } = this.state;

    if (Object.prototype.hasOwnProperty.call(chatSource, roomId)) {
      room.froms = chatSource[roomId].froms;
    }
    room.froms = room.froms || {};
    room.messages = room.messages || [];
    Object.keys(authorizedUsers).forEach((userId) => {
      room.froms[userId] = authorizedUsers[userId].name;
    });
    this.setChatSourceState(roomId, room);
  }

  onLeaveRoom(roomId) {

  }

  onNewMessage(roomId, message) {
    console.log('new message', message, 'roomId', roomId, 'chatsource', JSON.parse(JSON.stringify(this.state.chatSource)));
    const {
      userId: fromUserId, name: fromUserName,
    } = message;
    const { chatSource } = this.state;

    if (Object.prototype.hasOwnProperty.call(chatSource, roomId)) {
      const room = chatSource[roomId];
      // room.froms = room.froms || {};
      // room.froms[fromUserId] = fromUserName;
      if (Object.prototype.hasOwnProperty.call(room.froms, fromUserId) && room.froms[fromUserId]) {
        message.name = room.froms[fromUserId];
      }
      room.messages = room.messages || [];

      if (!(message.message instanceof Object)) {
        message.message = {
          message: message.message,
          type: 'plain_text',
        };
      }

      room.messages.push(message);
      chatSource[roomId] = room;

      this.setCustomState({
        chatSource,
      }, () => {
        console.log('after receive new message', JSON.parse(JSON.stringify(this.state.chatSource)));
      });

      if (this.state.chatDetail) {
        this.scrollToBottom();
      }
    }
  }

  onRemoveMessage(roomId, messageId) {

  }

  // Events related to chat invitations.
  onChatInvite(invitation) {
    chatInstance.acceptInvite(invitation.id);
  }

  onChatInviteResponse(invitation) {
    console.log('new invitation response', invitation);
    if (!invitation.status) return;

    const { chatSource } = this.state;

    if (Object.prototype.hasOwnProperty.call(chatSource, invitation.roomId)) {
      const room = chatSource[invitation.roomId];
      room.froms = room.froms || {};
      room.froms[invitation.fromUserId] = invitation.fromUserName;

      this.setCustomState((prevState) => {
        const prevChatSource = prevState.chatSource;
        prevChatSource[invitation.roomId] = room;
        return {
          chatSource: prevChatSource,
        };
      });

      console.log('enter here', room);

      this.enterMessageRoom(this.generateMessageRoomData(room.id, invitation.fromUserId, invitation.fromUserName, room));
    } else {
      chatInstance.getRoom(invitation.roomId, (room) => {
        room.messages = room.messages || [];
        room.froms = room.froms || {};
        room.froms[invitation.toUserId] = invitation.toUserName;
        room.froms[invitation.fromUserId] = invitation.fromUserName;

        this.setCustomState((prevState) => {
          const prevChatSource = prevState.chatSource;
          prevChatSource[invitation.roomId] = room;
          return {
            chatSource: prevChatSource,
          };
        });

        this.enterMessageRoom(this.generateMessageRoomData(room.id, invitation.fromUserId, invitation.fromUserName, room));
      });
    }
  }

  onChatItemClicked(room) {
    // console.log('onChatItemClicked', room);
    this.enterMessageRoom(room);
  }

  onSearchUserClicked(user) {
    this.chatWithUser(user.userData);
  }

  onSearchUser(e) {
    const query = e.target.value;
    this.setCustomState({
      searchUserString: query,
    });
    chatInstance.getUsersByPrefix(query, null, null, this.maxUserSearchResult, (userListFiltered) => {
      // console.log(userListFiltered);
      if (!query) {
        userListFiltered = [];
      }
      this.setCustomState({
        searchUsers: userListFiltered,
      });
    });
    e.preventDefault();
  }

  onCoinTextClicked(elementId, coinText) {
    const coinsTest = (new RegExp(this.coinTextRegEx)).exec(coinText.replace(/[\s]{2,}/g, ' '));

    if (coinsTest && coinsTest.length > 0) {
      let [_, amount, coinName] = coinsTest;
      amount = Number.parseFloat(amount);
      coinName = coinName.replace(/ethereum|ether|eth/i, 'ETH').replace(/bitcoin|btc/i, 'BTC');

      this.setState({
        // tooltipTarget: elementId,
        transferCoin: {
          amount,
          coinName,
        },
      });
    }
  }

  getLastMessages() {
    const { chatSource } = this.state;
    const messages = [];

    Object.keys(chatSource).forEach((roomId) => {
      const room = chatSource[roomId];
      if (room.froms && room.messages && room.messages.length > 0) {
        const fromNamesFiltered = Object.keys(room.froms).filter(userId => (userId !== this.user.id));
        const fromNames = fromNamesFiltered.map(userId => (room.froms[userId])).join(', ');
        const fromUserIds = fromNamesFiltered.map(userId => (userId)).join(',');
        const lastMessage = [...room.messages].reverse().find((message) => message.message.type != 'special');

        const lastMessageTime = lastMessage.timestamp;
        const lastMessageContent = lastMessage.message.message;

        messages.push({
          id: room.id,
          avatar: this.getUserAvatar(fromUserIds),
          avatarFlexible: true,
          // statusColor: 'lightgreen',
          alt: fromNames,
          title: fromNames,
          date: new Date(),
          subtitle: lastMessageContent,
          unread: 0,
          dateString: moment(new Date(lastMessageTime)).format('HH:mm'),
        });
      }
    });

    return messages;
  }

  getListSearchUsersSource(users) {
    const usersData = [];
    Object.keys(users).forEach((userName) => {
      const user = users[userName];
      const { online, name, id: userId } = user;

      usersData.push({
        id: userId,
        avatar: this.getUserAvatar(userId),
        avatarFlexible: true,
        statusColor: online ? 'lightgreen' : false,
        alt: name,
        title: name,
        subtitle: '',
        unread: 0,
        date: null,
        dateString: '',
        userData: user,
      });
    });

    return usersData;
  }

  getRoom(roomId) {
    const { chatSource } = this.state;
    if (Object.prototype.hasOwnProperty.call(chatSource, roomId)) {
      return chatSource[roomId];
    }

    return {};
  }

  getUserAvatar(userId) {
    // return `data:image/png;base64,${new Identicon(md5(userId)).toString()}`;
    return IconAvatar;
  }

  generateMessageRoomData(roomId, userId, userName, room) {
    return {
      id: roomId,
      avatar: this.getUserAvatar(userId),
      avatarFlexible: true,
      // statusColor: 'lightgreen',
      alt: userName,
      title: userName,
      date: new Date(),
      subtitle: '',
      unread: 0,
      dateString: moment(new Date()).format('HH:mm'),
    };
  }

  updateCurrentUserName(userName, roomId) {
    if (chatInstance) {
      chatInstance.updateUserName(userName, roomId);
    }
  }

  setCurrentUserName() {
    console.log('set current user name');
    if (this.isInChatTab) {
      this.props.setHeaderTitle(this.user.name);
    }
  }

  setUser(userId, userName) {
    const self = this;

    // Initialize data events
    chatInstance.setUser(userId, userName, !isInitialized, (user) => {
      self.user = user;

      const historyState = this.loadDataFromLocalStorage();
      if (historyState && isInitialized) {
        this.setCustomState(historyState, () => {
          this.updateHeaderLeft();
        });
      }

      isInitialized = true;

      chatInstance.resumeSession();
      this.updateCurrentUserName(userName);

      if (this.chatTo) {
        chatInstance.getUserById(this.chatTo, (user) => {
          if (user) {
            this.chatWithUser(user);
          }
        });
      }
    });
  }

  setChatSourceState(roomId, room) {
    this.setCustomState((prevState) => {
      const prevChatSource = prevState.chatSource;
      prevChatSource[roomId] = room;

      return {
        chatSource: prevState.chatSource,
      };
    });
  }

  setCustomState(state, cb) {
    this.setState(state, () => {
      if (cb) {
        setTimeout(() => {
          this.saveCurrentDataToLocalStorage();
        }, 0);
        cb();
      }
    });
  }

  loadDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem('chat_data'));
  }

  saveCurrentDataToLocalStorage() {
    localStorage.setItem('chat_data', JSON.stringify(this.state));
  }

  mixString(textOne, textTwo) {
    let result = '';
    const maxLength = textOne.length > textTwo.length ? textOne.length : textTwo.length;
    for (let i = 0; i < maxLength; i += 1) {
      const textOneCharCode = i < textOne.length ? textOne[i].charCodeAt() : 0;
      const textTwoCharCode = i < textTwo.length ? textTwo[i].charCodeAt() : 0;

      result += String.fromCharCode(textOneCharCode + textTwoCharCode);
    }

    return result;
  }

  updateHeaderLeft() {
    this.props.setHeaderLeft(this.state.chatDetail ? this.renderBackButton() : this.renderSearchButton());
  }

  signIn(user) {
    if (user) {
      const { profile } = this.props.auth;
      const userName = profile ? profile.username : `${user.uid.substr(10, 8)}`;
      this.setUser(user.uid, userName);
      return;
    }

    const { profile, token } = this.props.auth;

    if (!profile || !token) {
      console.log('You have not authorized to sign in to chat');
      return;
    }

    const username = `${md5(`${token}_${profile.id}`)}@handshake.autonomous.nyc`;
    const password = md5(token);
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInWithEmailAndPassword(username, password)
          .then((user) => {
            if (user) {
              // If the user is logged in, set them as the Firechat user
              this.signIn(user.user);
            } else {
              // console.log('cannot sign in into chat');
            }
          })
          .catch((error) => {
            firebase.auth().createUserWithEmailAndPassword(username, password).then((user) => {
              this.signIn(user.user);
            });
          });
      } else {
        this.signIn(user);
      }
    });
  }

  clearSearch() {
    if (this.searchBtnRef) {
      this.searchBtnRef.value = '';
      this.setCustomState({
        searchUserString: '',
        searchUsers: [],
      });
    }
  }

  enterMessageRoom(room) {
    const roomData = this.getRoom(room.id);
    this.setCustomState({
      chatDetail: room,
      currentMessage: '',
    }, () => {
      this.updateHeaderLeft();
      this.scrollToBottom();
    });
    this.clearSearch();
    this.props.setHeaderTitle(Object.keys(roomData.froms).filter(userId => (userId !== this.user.id)).map(userId => (roomData.froms[userId])).join(', '));
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  sendMessage(e, messageType = 'plain_text', args) {
    const { chatDetail, currentMessage } = this.state;
    if (currentMessage && chatDetail) {
      const { id: roomId } = chatDetail;
      const roomData = this.getRoom(roomId);
      const { authorizedUsers } = roomData;
      let publicKey;

      // get group public keys
      Object.keys(authorizedUsers).forEach((userId) => {
        if (userId === this.user.id) {
          return true;
        }

        // TO-DO: calculate public key from other users in group
        publicKey = authorizedUsers[userId].publicKey;
      });

      const message = {
        message: currentMessage,
        type: messageType,
        ...args,
      };
      chatInstance.sendMessage(roomId, message, publicKey, null, () => {
        if (this.chatInputRef) {
          this.chatInputRef.clear();
          this.chatInputRef.input.focus();
          this.scrollToBottom();
        }
      });
    }
    if (e) {
      e.preventDefault();
    }
  }

  chatWithUser(user) {
    const { id: userId, name: userName, publicKey: userPublicKey } = user;
    const roomId = md5(this.mixString(userId, this.user.id));

    if (Object.prototype.hasOwnProperty.call(this.state.chatSource, roomId)) {
      this.enterMessageRoom(this.generateMessageRoomData(roomId, userId, userName, this.state.chatSource[roomId]));
    } else {
      const usersInGroup = {};
      usersInGroup[userId] = {
        name: userName,
        publicKey: userPublicKey,
      };
      chatInstance.createRoom(roomId, usersInGroup, (room) => {
        chatInstance.inviteUser(userId, userName, userPublicKey, roomId);
        room.messages = room.messages || [];
        room.froms = {
          [userId]: userName,
          [this.user.id]: this.user.name,
        };

        console.log('enterRoom', roomId, 'room data', room);

        this.setCustomState((prevState) => {
          const prevChatSource = prevState.chatSource;
          prevChatSource[roomId] = room;
          return {
            searchUsers: [],
            chatSource: prevChatSource,
          };
        }, () => {
          console.log('onsearchuser click roomId', roomId, 'chatsource', JSON.parse(JSON.stringify(this.state.chatSource)));
          this.enterMessageRoom(this.generateMessageRoomData(roomId, userId, userName, room));
        });
      });
    }
  }

  processSpecialMessage(message) {
    let specialKeywordTest;
    const specialKeywordRegEx = new RegExp(/\[(\w+):(.+?)\]/ig);
    const replacementKeywords = {};
    while (specialKeywordTest = specialKeywordRegEx.exec(message)) {
      let [wholeText, keyword, value] = specialKeywordTest;
      keyword = keyword.toLowerCase();

      switch (keyword) {
        case 'user_id':
          const { chatDetail } = this.state;
          // if (this.user && value == this.user.id) {
          //   value = "You";
          // } else if (chatDetail) {
          //   const { authorizedUsers } = chatDetail.roomData;
          //   if (Object.prototype.hasOwnProperty.call(authorizedUsers, value)) {
          //     value = authorizedUsers[value].name;
          //   }
          // }
          value = 'I';
          break;
        case 'amount':
        case 'coin_name':
        case 'to_address':
          break;
      }
      replacementKeywords[wholeText] = value;
    }

    const messageArr = [];

    Object.keys(replacementKeywords).forEach((wholeText) => {
      const value = replacementKeywords[wholeText];
      const searchTextIndex = message.indexOf(wholeText);
      messageArr.push(message.substr(0, searchTextIndex));
      messageArr.push(<span className="special-text">{value}</span>);
      message = message.substr(searchTextIndex + wholeText.length);
    });

    if (message) {
      messageArr.push(message);
    }

    return messageArr;
  }

  processMessage(messageId, messageContent, messageType = 'plain_text') {
    switch (messageType) {
      case 'special':
        messageContent = this.processSpecialMessage(messageContent);
        break;
      case 'plain_text':
        const coinsTest = messageContent.match(this.coinTextRegEx);
        if (coinsTest && coinsTest.length > 0) {
          const messageArr = [];
          for (const i in coinsTest) {
            const coinMessage = coinsTest[i];
            const coinMessageIndex = messageContent.indexOf(coinMessage);
            messageArr.push(messageContent.substr(0, coinMessageIndex));
            messageArr.push(<span id={`coin-highlight-${messageId}-${i}`} className="coin-highlight" key={i} onClick={() => { this.onCoinTextClicked(`coin-highlight-${messageId}-${i}`, coinMessage); }}>{coinMessage}</span>);
            messageContent = messageContent.substr(coinMessageIndex + coinMessage.length);
          }

          if (messageContent) {
            messageArr.push(messageContent);
          }

          messageContent = messageArr;
        }
        break;
    }

    return messageContent;
  }

  bindDataEvents() {
    chatInstance.on('user-update', this.onUpdateUser.bind(this));

    // Bind events for new messages, enter / leaving rooms, and user metadata.
    chatInstance.on('room-enter', this.onEnterRoom.bind(this));
    chatInstance.on('room-exit', this.onLeaveRoom.bind(this));
    chatInstance.on('message-add', this.onNewMessage.bind(this));
    chatInstance.on('message-remove', this.onRemoveMessage.bind(this));

    // Bind events related to chat invitations.
    chatInstance.on('room-invite', this.onChatInvite.bind(this));
    chatInstance.on('room-invite-response', this.onChatInviteResponse.bind(this));
  }

  renderChatList() {
    const { searchUsers, searchUserString } = this.state;
    const isInSearchMode = !!searchUserString;
    const chatSource = isInSearchMode ? this.getListSearchUsersSource(searchUsers) : this.getLastMessages();

    return chatSource.length > 0 ? (
      <div>
        <ChatList
          dataSource={chatSource}
          onClick={isInSearchMode ? this.onSearchUserClicked : this.onChatItemClicked}
        />
      </div>
    ) : this.renderEmptyMessage(isInSearchMode ? 'The Ninja you are looking for is not here. Perhaps you have their name wrong.' : 'Trade secrets here. All communication is encrypted and no one is listening.');
  }

  renderBackButton() {
    return (<img src={IconBackBtn} onClick={this.onBackButtonClicked} />);
  }

  renderSearchButton() {
    return (
      <div className="chat-search-container">
        <input
          ref={(ref) => { this.searchBtnRef = ref; }}
          type="search"
          className="rce-search-input"
          onChange={this.onSearchUser}
          onBlur={() => { setTimeout(() => { this.clearSearch(); }, 100); }}
          placeholder="Enter a ninja’s name or alias."
        />
      </div>
    );
  }

  renderEmptyMessage(message) {
    return (
      <div className="no-data">
        <p className="text">{message}</p>
      </div>
    );
  }

  renderChatDetail(room) {
    // console.log('render chat detail', room);
    const roomData = this.getRoom(room.id);
    const { messages } = roomData;
    let prevUserId = null;

    const messageList = messages.map((message, messageId) => {
      const { name: messageName, userId } = message;
      const { message: messageContent, type: messageType } = message.message;
      const notch = userId !== prevUserId;
      prevUserId = userId;

      return {
        avatar: notch && userId !== this.user.id ? this.getUserAvatar(userId) : null,
        position: userId !== this.user.id ? 'left' : 'right',
        type: 'text',
        title: null,
        text: this.processMessage(messageId, messageContent, messageType),
        notch,
        dateString: moment(new Date(message.timestamp)).format('HH:mm'),
        className: messageType === 'special' ? 'special' : '',
      };
    });

    return (
      <div>
        <MessageList
          ref={(ref) => { this.messageListRef = ref; }}
          dataSource={messageList}
          toBottomHeight="100%"
          downButton
        />
        <Input
          placeholder="Type a message..."
          multiline={false}
          ref={(ref) => { this.chatInputRef = ref; }}
          onFocus={(e) => { this.scrollToBottom(); }}
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              this.sendMessage();
              e.preventDefault();
              return false;
            }
          }}
          onChange={(e) => { this.setCustomState({ currentMessage: e.target.value }); }}
          rightButtons={
            <img
              src={IconBtnSend}
              onClick={this.sendMessage}
              alt=""
            />
          }
        />
      </div>
    );
  }

  toggleTooltip() {
    this.setState({
      tooltipTarget: '',
    });
  }

  render() {
    const { chatDetail, tooltipTarget, transferCoin } = this.state;
    return (
      <div className="chat-container">
        {chatDetail ? this.renderChatDetail(chatDetail) : this.renderChatList()}
        {/* {this.state.tooltipTarget &&
          <Popover isOpen={true} placement={'bottom'} toggle={this.toggleTooltip} target={this.state.tooltipTarget}>
            <PopoverBody>
              Pay or Request
            </PopoverBody>
          </Popover>
        } */}
        {
          // Object.keys(transferCoin).length > 0 && (
          //   <Modal
          //     title="Transfer coin"
          //     ref={(modalRef) => {
          //       this.modalRef = modalRef;
          //       modalRef && modalRef.open();
          //     }}
          //     onClose={() => {
          //       this.setState({ transferCoin: {} });
          //     }}>
          //     <TransferCoin coinName={transferCoin.coinName} amount={transferCoin.amount} onFinish={(transferResult) => {
          //       const { toAddress, fromWallet, amount } = transferResult;
          //       this.setState({
          //         currentMessage: `Mission complete. Sent [AMOUNT:${amount}] [COIN_NAME:${fromWallet.name}] to [TO_ADDRESS:${toAddress}]`,
          //       }, () => {
          //         this.sendMessage(null, 'special', { specialTag: 'transfer_coin' });
          //         this.modalRef && this.modalRef.close();
          //       });
          //     }} />
          //   </Modal>
          // )
        }
      </div>
    );
  }
}

Chat.propTypes = {
  discover: PropTypes.object,
};

const mapState = state => ({
  auth: state.auth,
});

export default connect(mapState, ({ setHeaderLeft, setHeaderTitle }))(Chat);
