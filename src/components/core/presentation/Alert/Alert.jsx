import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// actions
import { hideAlert } from '@/reducers/app/action';
// style
import './Alert.scss';

class Alert extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      message: '',
      type: ''
    };
    // bind
    this.handleShowAlert = ::this.handleShowAlert;
  }

  configDefault = {
    isShow: false,
    message: '',
    timeOut: 5000,
    type: '',
  };

  getTypeClass(type) {
    switch (type) {
      case 'primary': return 'alert-primary';
      case 'secondary': return 'alert-secondary';
      case 'success': return 'alert-success';
      case 'danger': return 'alert-danger';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      case 'light': return 'alert-light';
      case 'dark': return 'alert-dark';
      default: return 'alert-primary';
    }
  }

  handleShowAlert(props) {
    const { configAlert } = props.app;
    const config = Object.assign({}, this.configDefault, configAlert);
    if (config.isShow) {
      setTimeout(() => {
        this.props.hideAlert();
      }, config.timeOut);
    }
    this.setState({ ...config });    
  }

  componentWillReceiveProps(nextProps) {
    this.handleShowAlert(nextProps);
  }

  render() {
    const { isShow, type, message } = this.state;
    const tyleClassName = this.getTypeClass(type);
    if (!isShow) return null;
    return (
      <div className={`alert alerts ${tyleClassName}`} role="alert">
        {message}
      </div>
    );
  }
}

Alert.propTypes = {
  app: PropTypes.object,
  hideAlert: PropTypes.func,
};

const mapState = state => ({
  app: state.app,
});

const mapDispatch = ({
  hideAlert
});

export default connect(mapState, mapDispatch)(Alert);
