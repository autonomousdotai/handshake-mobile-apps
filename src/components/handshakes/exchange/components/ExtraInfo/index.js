import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import IconInfo from '@/assets/images/icon/question-circle.svg';
import './styles.scss';

class ExtraInfo extends Component {
  constructor() {
    super();
    this.state = { show: false, canRenderTooltip: false };

    this.toggle = :: this.toggle;
    this.icon = React.createRef();
  }

  componentDidMount() {
    /* eslint-disable-next-line */
    this.setState({ canRenderTooltip: true });
  }

  toggle(show) {
    this.setState({ show: show === undefined ? !this.state.show : show });
  }

  render() {
    const { show, canRenderTooltip } = this.state;
    const { info, className } = this.props;
    return (
      <span className={`extra-info-container ${className}`}>
        <img src={IconInfo} alt="" width="12" className="extra-info-icon" ref={this.icon} />
        {canRenderTooltip && (
          <Tooltip
            placement="bottom"
            isOpen={show}
            target={this.icon?.current}
            toggle={() => this.toggle()}
          >
            {info}
          </Tooltip>
        )}
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
