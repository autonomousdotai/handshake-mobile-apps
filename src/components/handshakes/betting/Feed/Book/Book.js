import React from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import './Book.scss';

const BN = Web3.utils.BN;
const ROUND_ODDS = 10;
const ROUND = 1000000;
class BetBook extends React.Component {
  constructor(props) {
    super(props);
    const { odd } = props;
    this.state = {};
  }

  render() {
    const { item } = this.props;
    const { amount, odds } = item;
    const { amountColor } = this.props;
    // console.log('OK_____ ',typeof amount);
    // const amountBN = new BN(amount);
    // console.log('OK_____ 11 ',amountBN.toString);
    const oppositeOdds = odds / (odds - 1);
    const amountStyle = {
      color: amountColor,
    };
    console.log('Odds:', odds);
    return (
      <div className="wrapperBettingBook">
        <div className="oddText">{Math.floor(parseFloat(amount) * ROUND) / ROUND}</div>
        <div className="amountText" style={amountStyle}>{Math.floor(odds * ROUND_ODDS) / ROUND_ODDS}</div>
        {/* <div className="amountText" style={amountStyle}>/{parseFloat(oppositeOdds).toFixed(2)}</div> */}
      </div>
    );
  }
}

BetBook.propTypes = {
  amountColor: PropTypes.string,
};

BetBook.defaultProps = {
  amountColor: '#FA6B49',
};

export default BetBook;
