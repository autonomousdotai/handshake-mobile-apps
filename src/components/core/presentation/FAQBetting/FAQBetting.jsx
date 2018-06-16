import React from 'react';
import './FAQBetting.scss';

class FAQBetting extends React.PureComponent {
  render() {
    return (
      <dl className="faq-betting faq">
        <dt>Price (Odds)</dt>
        <dd>
          Ninja uses
          <strong>decimal odds</strong>. A winning bet at 1.75 would return a total of
          1.75 ETH for every ETH staked. An even money bet is expressed as 2.00.
        </dd>
        <dt>Pool (ETH)</dt>
        <dd>
          The total bets for different price points (odds). Green: Support orders. Red:
          Oppose orders.
        </dd>
        <dt>Support or Oppose</dt>
        <dd>
          Pick a side to bet on. You can support the outcome or oppose the outcome.
        </dd>
        <dt>Market odds</dt>
        <dd>
          You can bet with the market odds, which will likely be matched immediately with
          existing orders on the order book, or set your own odds, which will likely go on
          the order book to wait for a matching order.
        </dd>
        <dt>Market volume</dt>
        <dd>
          The total volume of bets on this outcome.
        </dd>
        <dt>Market fee</dt>
        <dd>
          This is the fee set by the market creator, as a percentage of the winnings. A
          market fee of 1% would be 1ETH on a winning payout of 100 ETH.
        </dd>
      </dl>
    );
  }
}

export default FAQBetting;
