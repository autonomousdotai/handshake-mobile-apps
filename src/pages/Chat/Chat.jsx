import React, { Component } from 'react';
// import { Popover, PopoverBody } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MessageList, ChatList, Input } from 'react-chat-elements';
import moment from 'moment';
import { injectIntl } from 'react-intl';

// import Identicon from 'identicon.js';
// import TransferCoin from '@/components/Wallet/TransferCoin';
import Modal from '@/components/core/controls/Modal';
import { getUserName } from '@/reducers/chat/action';
import { bindActionCreators } from 'redux';
import { API_URL } from '@/constants';

import { setHeaderLeft, setHeaderTitle, showLoading, hideLoading } from '@/reducers/app/action';
import IconBtnSend from '@/assets/images/icon/ic-btn-send.svg';
import IconBackBtn from '@/assets/images/icon/back-chevron.svg';
import IconAvatar from '@/assets/images/icon/avatar.svg';
import md5 from 'md5';

import './Firechat.scss';
import './Chat.scss';

let isComponentBound = false;

class Chat extends Component {
  static propTypes = {
    setHeaderLeft: PropTypes.func.isRequired,
    setHeaderTitle: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    getUserName: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    match: PropTypes.object,
    hideLoading: PropTypes.func.isRequired,
    showLoading: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: {},
  }

  constructor(props) {
    super(props);
    this.coinTextRegEx = /([-+]?[0-9]*\.?[0-9]+)\s*?(ETHEREUM|BITCOIN|ETHER|ETH|BTC)/gi;
    this.user = null;

    this.state = {
      chatSource: {},
      chatDetail: null,
      searchUserString: '',
      searchUsers: [],
      tooltipTarget: '',
      transferCoin: {},
      isMounted: false,
      notFoundUser: false,
      currentMessage: '',
    };

    this.firechat = this.props.app.firechat;

    this.chatInputRef = React.createRef();
    this.messageListRef = null;
    this.searchBtnRef = null;
    this.modalRef = null;
    this.maxUserSearchResult = null;
    this.isInChatTab = true;

    this.renderChatList = :: this.renderChatList;
    this.renderChatDetail = :: this.renderChatDetail;
    this.onChatItemClicked = :: this.onChatItemClicked;
    this.onSearchUserClicked = :: this.onSearchUserClicked;
    this.sendMessage = :: this.sendMessage;
    this.onSearchUser = :: this.onSearchUser;
    this.onBackButtonClicked = :: this.onBackButtonClicked;

    this.chatWithUserId = props.match.params.userId;
    this.componentMounted = false;
    this.initialized = false;

    if (!isComponentBound) {
      this.saveCurrentDataToLocalStorage();
    }
  }

  componentDidMount() {
    this.componentMounted = true;
    this.initChatComponent();
  }

  componentWillReceiveProps(nextProps) {
    this.firechat = nextProps.app.firechat;
    this.initChatComponent();
  }

  componentWillUnmount() {
    this.isInChatTab = false;
    this.componentMounted = false;
    if (this.initialized) {
      this.firechat.enableNotification();
      this.unBindDataEvents();
    }
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

      this.enterMessageRoom(this.generateMessageRoomData(room.id, invitation.fromUserId, invitation.fromUserName, room));
    } else {
      this.firechat.getRoom(invitation.roomId, (room) => {
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
    this.firechat.getUsersByPrefix(query, null, null, this.maxUserSearchResult, (userListFiltered) => {
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

  onRoomUpdate(roomId, room) {
    console.log('onRoomUpdate', roomId, room, this.componentMounted);
    if (this.componentMounted) {
      let { chatSource } = this.state;
      chatSource = chatSource || {};
      chatSource[roomId] = room;
      this.setCustomState({
        chatSource,
      });
    }
  }

  onNewMessage(roomId, message) {
    console.log('onNewMessage', roomId, message);
    const { chatDetail } = this.state;
    if (chatDetail && chatDetail === roomId) {
      setTimeout(() => {
        this.firechat.markMessagesAsRead(roomId);
      }, 0);
    }
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

  setCurrentUserName() {
    if (this.componentMounted) {
      this.props.setHeaderTitle(this.user.name);
    }
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
      setTimeout(() => {
        this.saveCurrentDataToLocalStorage();
      }, 0);
      if (cb) {
        cb();
      }
    });
  }

  getRoomList() {
    const { chatSource } = this.state;
    const { messages } = this.props.intl;
    const rooms = { ...chatSource };
    return Object.values(rooms)
      .reverse()
      .filter(room => room.froms && room.messages && room.messages.length > 0)
      .sort((prevRoom, nextRoom) => {
        const prevRoomLastMessage = this.getLastMessage(prevRoom.messages);
        const nextRoomLastMessage = this.getLastMessage(nextRoom.messages);

        const prevCompareTime = prevRoomLastMessage ? prevRoomLastMessage.timestamp : prevRoom.createdAt;
        const nextCompareTime = nextRoomLastMessage ? nextRoomLastMessage.timestamp : nextRoom.createdAt;

        return nextCompareTime - prevCompareTime;
      })
      .map((room) => {
        const fromNamesFiltered = Object.keys(room.froms).filter(userId => (userId !== this.user.id));
        const fromNames = fromNamesFiltered.map(userId => (room.froms[userId])).join(', ');
        const fromUserIds = fromNamesFiltered.map(userId => (userId)).join(',');
        const lastMessage = this.getLastMessage(room.messages);

        const lastMessageTime = lastMessage ? lastMessage.timestamp : null;
        const lastMessageContent = lastMessage ? (lastMessage.message.message || messages.chat.lastMessageContent) : '';
        const isRead = lastMessage && lastMessage.actions ? (lastMessage.actions[this.user.id]?.seen) : true;

        return {
          id: room.id,
          avatar: this.getUserAvatar(fromUserIds),
          avatarFlexible: true,
          // statusColor: 'lightgreen',
          alt: fromNames,
          title: fromNames,
          date: new Date(),
          subtitle: lastMessageContent,
          className: !isRead ? 'un-read' : '',
          dateString: lastMessageTime ? moment(new Date(lastMessageTime)).format('HH:mm') : '',
        };
      });
  }

  getLastMessage(messages) {
    const reverseMessage = messages.slice().reverse();
    const lastMessage = reverseMessage.find(message => message.message.type === 'plain_text');
    return lastMessage;
  }

  getListSearchUsersSource(users) {
    return users.map((user) => {
      const { online, name, id: userId } = user;
      return {
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
      };
    });
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

  initChatRooms() {
    this.user = this.firechat.getCurrentUser();
    this.props.showLoading();
    this.updateHeaderLeft();
    this.updateHeaderTitle();

    // TODO: load state from local storage and display when component bound
    const historyState = this.loadDataFromLocalStorage();
    if (historyState && isComponentBound) {
      this.setCustomState(historyState, () => {
        this.updateHeaderLeft();
        this.updateHeaderTitle();
      });
    }

    this.setCustomState({
      chatSource: this.firechat.getRooms(),
    }, () => {
      if (this.chatWithUserId) {
        this.props.getUserName({
          PATH_URL: `${API_URL.CHAT.GET_USER_NAME}/${this.chatWithUserId}`,
          successFn: (response) => {
            const { data: chatToUserName } = response;
            this.firechat.getUserById(chatToUserName, (chatToUser) => {
              this.chatWithUser(chatToUser);
              this.props.hideLoading();
            });
          },
          errorFn: (e) => {
            this.chatWithUser(null);
            this.props.hideLoading();
          },
        });
      } else {
        this.props.hideLoading();
      }
    });

    isComponentBound = true;
  }

  initChatComponent() {
    if (this.initialized) {
      return;
    }

    if (this.props && this.props.auth && Object.keys(this.firechat).length > 0 && this.componentMounted) {
      console.log('chat initialized');
      this.initialized = true;
      this.firechat.disableNotification();
      this.initChatRooms();
      this.bindDataEvents();
    } else {
      setTimeout(() => { this.initChatComponent(); }, 500);
    }
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

  updateHeaderTitle() {
    const { chatDetail } = this.state;

    if (chatDetail) {
      const roomData = this.getRoom(chatDetail);
      if (!roomData) {
        return;
      }
      this.props.setHeaderTitle(Object.keys(roomData.froms).filter(userId => (userId !== this.user.id)).map(userId => (roomData.froms[userId])).join(', '));
    } else if (this.user) {
      this.props.setHeaderTitle(this.user.name);
    }
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
    const roomId = room.id;
    this.setCustomState({
      chatDetail: roomId,
      notFoundUser: false,
    }, () => {
      this.updateHeaderLeft();
      this.scrollToBottom();
      this.clearSearch();
      this.updateHeaderTitle();
      setTimeout(() => {
        this.firechat.markMessagesAsRead(roomId);
      }, 0);
    });
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  sendMessage(message, messageType = 'plain_text', args) {
    const { chatDetail: roomId } = this.state;
    if (message && roomId) {
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

      const sendMessageObj = {
        message,
        type: messageType,
        ...args,
      };
      this.firechat.sendMessage(roomId, sendMessageObj, publicKey, null, () => {
        this.scrollToBottom();
      });

      if (this.chatInputRef) {
        this.chatInputRef.clear();
        this.chatInputRef.input.focus();
      }
    }
  }

  chatWithUser(user) {
    if (!user) {
      // TODO: show not found user message
      this.setCustomState({
        notFoundUser: true,
      });
      return;
    }

    if (!this.user) {
      setTimeout(() => {
        this.chatWithUser(user);
      }, 100);
      return;
    }

    console.log('chat with username', user);

    const { id: userId, name: userName, publicKey: userPublicKey } = user;

    if (userId === this.user.id) {
      return;
    }

    const roomId = md5(this.mixString(userId, this.user.id));

    if (Object.prototype.hasOwnProperty.call(this.state.chatSource, roomId)) {
      this.enterMessageRoom(this.generateMessageRoomData(roomId, userId, userName, this.state.chatSource[roomId]));
    } else {
      const usersInGroup = {};
      usersInGroup[userId] = {
        name: userName,
        publicKey: userPublicKey,
      };
      this.firechat.createRoom(roomId, usersInGroup, (room) => {
        this.firechat.inviteUser(userId, userName, userPublicKey, roomId);
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

    Object.keys(replacementKeywords).forEach((wholeText, i) => {
      const value = replacementKeywords[wholeText];
      const searchTextIndex = message.indexOf(wholeText);
      const key = `special-text-${i}`;
      messageArr.push(message.substr(0, searchTextIndex));
      messageArr.push(<span className="special-text" key={key}>{value}</span>);
      message = message.substr(searchTextIndex + wholeText.length);
    });

    if (message) {
      messageArr.push(message);
    }

    return messageArr;
  }

  processMessage(messageId, messageContent, messageType = 'plain_text') {
    switch (messageType) {
      case 'special': {
        messageContent = this.processSpecialMessage(messageContent);
        break;
      }
      case 'plain_text': {
        const coinsTest = messageContent.match(this.coinTextRegEx);
        if (coinsTest && coinsTest.length > 0) {
          const messageArr = [];
          coinsTest.forEach((coinMessage, i) => {
            const coinMessageIndex = messageContent.indexOf(coinMessage);
            const key = `coin-highlight-${messageId}-${i}`;
            messageArr.push(messageContent.substr(0, coinMessageIndex));
            messageArr.push(<span id={key} className="coin-highlight" key={key} onClick={() => { this.onCoinTextClicked(key, coinMessage); }}>{coinMessage}</span>);
            messageContent = messageContent.substr(coinMessageIndex + coinMessage.length);
          });

          if (messageContent) {
            messageArr.push(messageContent);
          }

          messageContent = messageArr;
        }
        break;
      }
      default:
        break;
    }

    return messageContent;
  }

  bindDataEvents() {
    console.log('bound data events');
    this.firechat.bind('user-update', :: this.onUpdateUser);

    // // Bind events for new messages, enter / leaving rooms, and user metadata.
    // this.firechat.on('room-enter', this.onEnterRoom.bind(this));
    // this.firechat.on('room-exit', this.onLeaveRoom.bind(this));
    this.firechat.bind('message-add', ::this.onNewMessage);
    // this.firechat.on('message-remove', this.onRemoveMessage.bind(this));

    // // Bind events related to chat invitations.
    // this.firechat.bind('room-invite', :: this.onChatInvite);
    this.firechat.bind('room-invite-response', :: this.onChatInviteResponse);
    this.firechat.bind('room-update', :: this.onRoomUpdate);
  }

  unBindDataEvents() {
    console.log('unbound data events');
    this.firechat.unbind('message-add', this.onNewMessage.bind(this));
    this.firechat.unbind('user-update');
    // this.firechat.unbind('room-invite');
    this.firechat.unbind('room-invite-response');
    this.firechat.unbind('room-update');
  }

  renderNotFoundUser() {
    const { messages } = this.props.intl;
    return this.renderEmptyMessage(messages.chat.notFoundUser);
  }

  renderChatList() {
    const { searchUsers, searchUserString } = this.state;
    const { messages } = this.props.intl;
    const isInSearchMode = !!searchUserString;
    const chatSource = isInSearchMode ? this.getListSearchUsersSource(searchUsers) : this.getRoomList();

    return chatSource.length > 0 ? (
      <div>
        <ChatList
          dataSource={chatSource}
          onClick={isInSearchMode ? this.onSearchUserClicked : this.onChatItemClicked}
        />
      </div>
    ) : (isInSearchMode ? this.renderNotFoundUser() : this.renderEmptyMessage(messages.chat.emptyMessage));
  }

  renderBackButton() {
    return (<img src={IconBackBtn} onClick={this.onBackButtonClicked} />);
  }

  renderSearchButton() {
    const { messages } = this.props.intl;
    return (
      <div className="chat-search-container">
        <input
          ref={(ref) => { this.searchBtnRef = ref; }}
          type="search"
          className="rce-search-input"
          onChange={this.onSearchUser}
          onBlur={() => { setTimeout(() => { this.clearSearch(); }, 100); }}
          placeholder={messages.chat.searchPlaceHolder}
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
    const roomData = this.getRoom(room);
    const { messages } = roomData;
    let prevUserId = null;

    const messageList = messages.map((message, messageId) => {
      const { userId } = message;
      const { message: messageContent, type: messageType } = message.message;
      const notch = userId !== prevUserId;
      prevUserId = userId;

      return {
        avatar: notch && userId !== this.user.id ? this.getUserAvatar(userId) : null,
        position: userId !== this.user.id ? 'left' : 'right',
        type: 'text',
        title: null,
        text: messageContent ? this.processMessage(messageId, messageContent, messageType) : 'You lost the key to this secret message.',
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
          onFocus={() => { this.scrollToBottom(); }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              this.sendMessage(this.state.currentMessage);
              e.preventDefault();
              return false;
            }
          }}
          onChange={(e) => {
            this.setState({
              currentMessage: e.target.value,
            });
          }}
          rightButtons={
            <img
              src={IconBtnSend}
              onClick={() => { this.sendMessage(this.state.currentMessage); }}
              alt=""
            />
          }
        />
      </div>
    );
  }

  render() {
    const { chatDetail, notFoundUser } = this.state;
    return (
      <div className="chat-container">
        {notFoundUser ? this.renderNotFoundUser() : (chatDetail ? this.renderChatDetail(chatDetail) : this.renderChatList())}
        {
          // Object.keys(transferCoin).length > 0 && (
          //   <Modal
          //     title="Transfer coin"
          //     ref={(modalRef) => {
          //       this.modalRef = modalRef;
          //       return modalRef && modalRef.open();
          //     }}
          //     onClose={() => {
          //       this.setState({ transferCoin: {} });
          //     }}
          //   >
          //     <TransferCoin
          //       coinName={transferCoin.coinName}
          //       amount={transferCoin.amount}
          //       onFinish={(transferResult) => {
          //         const { toAddress, fromWallet, amount } = transferResult;
          //         this.setState({
          //           currentMessage: `Mission complete. Sent [AMOUNT:${amount}] [COIN_NAME:${fromWallet.name}] to [TO_ADDRESS:${toAddress}]`,
          //         }, () => {
          //           this.sendMessage(null, 'special', { specialTag: 'transfer_coin' });
          //           return this.modalRef && this.modalRef.close();
          //         });
          //       }}
          //     />
          //   </Modal>
          // )
        }
      </div>
    );
  }
}

const mapState = state => ({
  app: state.app,
  auth: state.auth,
  firebaseUser: state.firebaseUser,
});

const mapStateDispatch = dispatch => ({
  setHeaderLeft: bindActionCreators(setHeaderLeft, dispatch),
  setHeaderTitle: bindActionCreators(setHeaderTitle, dispatch),
  getUserName: bindActionCreators(getUserName, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
});

export default injectIntl(connect(mapState, mapStateDispatch)(Chat));
