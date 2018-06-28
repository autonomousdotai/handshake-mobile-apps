/**
 * Handshake component.
 */
import React from 'react';
import {FormattedMessage, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
// service

// style
import './FAQ.scss';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow-white.svg';
import ninjaIcon from '@/assets/images/ninja/ninja-header.svg';
import shurikenIcon from '@/assets/images/ninja/shuriken-icon.svg';

const data = [
  {
    question: 'What is Ninja PEX?',
    answer: 'Ninja is an anonymous peer-to-peer decentralized prediction exchange running on top of the Ethereum blockchain.',
  },
  {
    question: 'What’s special about PEX? Why should i bet on one?',
    answer: 'It allows parties to directly bet against each other without going through a central authority or bookmaker. This makes it 100% anonymous, no signs up no downloads required. The management of bets and the settlement of winnings are carried out collectively by the blockchain network, protecting users from any single point of failure. You can also create your own prediction markets.',
  },
  {
    question: 'Do I need Ether? Does it support other cryptocurrencies?',
    answer: 'It allows parties to directly bet against each other without going through a central authority or bookmaker. This makes it 100% anonymous, no signs up no downloads required. The management of bets and the settlement of winnings are carried out collectively by the blockchain network, protecting users from any single point of failure. You can also create your own prediction markets.',
  },
  {
    question: 'How do I start with Ninja?',
    isList: true,
    answer: [
      {
        title: 'Get Ether:',
        content: ' You can either buy ETH directly in PEX with your credit cards or from popular coin exchanges like Coinbase or Binance.',
      },
      {
        title: 'Top up your PEX Wallet:',
        content: 'You can either buy ETH directly in PEX with your credit cards or from popular coin exchanges like Coinbase or Binance.',
      },
      {
        title: 'Place a bet:',
        content: 'Pick the market you want to bet (i.e. Brazil - Spain), the outcomes (i.e. Brazil wins) and the site (i.e. support or bet against the outcome)\n' +
        'Enter the stake you want to bet (i.e. 1 ETH) and the odds (i.e. 1/ 2.25)\n' +
        'The PEX Matching Engine will then find another order that bets against the odds you set.',
      },
      {
        title: 'Wait for the report:',
        content: 'if you win, your winnings will be automatically transferred from the escrow smart contract to your account.',
      },
    ],
  },
  {
    question: 'What’s special about PEX? Why should i bet on one?',
    answer: 'Yes! When creating your own bet, you’ll enter the event you’re interested in and the outcome you want to bet on. Then, simply enter your stake and the odds you want. Then the PEX Engine will automatically find and match you with anyone that has an interest in the same event, and who accepts your odds.',
  },
  {
    question: 'How do you police unsavory/illegal bets?',
    answer: 'We are currently building a system of checks and balances to flag up inappropriate behaviour in the dojo.',
  },
  {
    question: 'How does the system know the result of bets between people? Who acts as arbitrator and verifies one outcome vs. another at conclusion of contract?',
    answer: 'Ninja will soon have a completely decentralized solution for verifying the outcome and incentivizing truth telling (a DAO of reporters!). In the meantime, as we will launch just in time for the FIFA world cup, our team will use a public source (livescore.com) and act as the reporter.',
  },
  {
    question: 'Where is the coin held?',
    answer: 'No one holds the funds. All the funds are kept safe in escrow until a resolution is reached.',
  },
  {
    question: 'Why should I bet on blockchain instead of using traditional methods?',
    answer: 'A decentralized prediction exchange will provide you the freedom to create your own odds and bet directly with anyone, offer you 100% ninja anonymity and guaranteed payouts.',
  },
  {
    question: 'How about privacy and anonymity?',
    answer: 'Ninja requires no downloads, and no sign ups. That means no passwords, no phone numbers and no emails. 100% anonymity.',
  },
  {
    question: 'Do I need to pay any fees?',
    answer: 'There are two main types of fees: creator fees (for the ninja that creates the bet) and the network fee (a percentage of the creator fee, that goes towards maintaining the platform).',
  },
  {
    question: 'What do I need to do when the outcome is finalized?',
    answer: 'Nothing. If you win, your winnings will be automatically transferred to your account. If you lose, it will be someone else’s account.',
  },
  {
    question: 'Where can I find a match to bet on?',
    answer: 'On the homepage, you’ll be able to browse ongoing bets and markets. If you can’t find any you like, create your own!',
  },
  {
    question: 'Other than sports, can I bet on anything else? How does it work?',
    answer: 'Very soon, Ninja will apply to everything under the sun. The only limitation will be your creativity. You can easily create any market on any future event, be it sports, politics, science, markets, climate… you name it.',
  },
  {
    question: 'What’s gonna happen to the Handshake mobile app?',
    answer: 'We will be integrating Handshake (and your favourite features like promises, IOUs, contract upload, etc.) into the Ninja mobile website.',
  },
];

class Collapse extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
    };
    this.toggle = ::this.toggle;
  }

  toggle() {
    this.setState(state => ({isCollapsed: !state.isCollapsed}));
  }

  render() {
    const { isCollapsed } = this.state;
    const { label, content, isList, index } = this.props;
    return (
      <div className="collapse-custom">
        <div
          className="head"
          onClick={this.toggle}
        >
          <p className="label">
            <span className="index">{index}{index > 9 ? '.' : '. '}</span><span>{label}</span>
          </p>
          <div className="extend">
            <img className={isCollapsed ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
          </div>
        </div>
        <div className={`content ${isList ? '' : 'noList'} ${!isCollapsed ? '' : 'd-none'}`}>
          {isList ? (
            <dl>
              {content.map((item, index) => [
                <dt key={`dt_${index}`}>{item.title}</dt>,
                <dd key={`dd_${index}`}>{item.content}</dd>
              ])}
            </dl>
          ) : content}
        </div>
      </div>
    )
  }
}

class FAQ extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const appContainer = document.getElementById('app');
    appContainer.style.backgroundColor = '#161616';
  }

  render() {
    const { locale, messages } = this.props.intl;
    return (
      <div className="container faq">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-xs-12">
            <div className="headerPage">
              <a href="/"><img src={ninjaIcon} alt="shuriken icon" /></a>
              <span><span className="yellow" hidden={locale !== 'en'}><FormattedMessage id="FAQ_HEADER_YELLOW" /></span> <FormattedMessage id="FAQ_HEADER" /></span>
            </div>
          </div>
          <div className="col-lg-12">
            <h1><FormattedMessage id="FAQ_TITLE" /></h1>
            <div>
              {messages.FAQ_DATA.map((item, index) => <Collapse label={item.question} content={item.answer} isList={item.isList} key={index} index={index + 1} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(FAQ);
