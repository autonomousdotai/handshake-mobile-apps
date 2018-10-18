import React from 'react';
import { getGasPrice, formatAmount, getEstimateGas } from '@/components/handshakes/betting/utils.js';
import './EstimateGas.scss';

class EstimateGas extends React.Component {

  state = {
    estimateGas: 0,

  }

  async componentDidMount() {
    const estimateGas = await getEstimateGas();
    this.setState({
      estimateGas,
    });
  }

  render() {
    const { estimateGas } = this.state;

    return (
      <div className="estimateRowWrapper">
        <div className="gasPriceTitle">Gas price</div>
        <div className="estimateGasValue">{formatAmount(estimateGas)} ETH</div>
      </div>
    );
  }
}
export default EstimateGas;
