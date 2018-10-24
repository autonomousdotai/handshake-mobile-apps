import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import IconInfo from '@/assets/images/icon/question-circle.svg';
import './styles.scss';

class ExtraInfo extends Component {
  constructor() {
    super();
    this.state = { show: false };

    this.toggle = :: this.toggle;
    this.icon = React.createRef();
  }

  toggle(show) {
    this.setState({ show: show === undefined ? !this.state.show : show });
  }

  render() {
    const { show } = this.state;
    const { info, className } = this.props;
    return (
      <span className={`extra-info-container ${className}`}>
        <img src={IconInfo} alt="" width="12" className="extra-info-icon" ref={this.icon} />
        <Tooltip
          placement="bottom"
          isOpen={show}
          target={this.icon?.current || '.extra-info-icon'}
          toggle={() => this.toggle()}
        >
          {info}
        </Tooltip>
      </span>
    );
  }
}

ExtraInfo.defaultProps = {
  className: '',
};

ExtraInfo.propTypes = {
  info: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ExtraInfo;
