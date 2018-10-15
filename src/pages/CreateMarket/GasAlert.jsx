import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
import StickyHeader from '@/components/StickyHeader/StickyHeader';
import WarningIcon from '@/assets/images/pex/warning.svg';

class GasAlert extends React.PureComponent {
  static displayName = 'GasAlert';
  static propTypes = {
    insufficientGas: PropTypes.any,
  };

  static defaultProps = {
    insufficientGas: null,
  }

  renderComponent = (props) => {
    if (typeof props.insufficientGas !== 'string') {
      return null;
    }
    return (
      <StickyHeader elementId="InsufficientGas">
        <div>
          <img src={WarningIcon} alt="" className="WarningIcon" />
          {` Please `}
          <Link to={{ pathname: URL.HANDSHAKE_WALLET }}>top up your wallet</Link>
          {` with enough ETH to cover gas fees.`}
        </div>
      </StickyHeader>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}


export default GasAlert;
