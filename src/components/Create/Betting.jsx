import React from 'react';
import BettingDetail from '@/components/Betting/BettingDetail';
class BettingPromise extends React.Component {
  render() {
    return  <BettingDetail onClickSend={()=> console.log('Click send')}/>
    ;
  }
}

export default BettingPromise;
