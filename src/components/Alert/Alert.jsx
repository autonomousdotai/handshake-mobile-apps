import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// actions
import { hideAlert } from '@/reducers/app/action';
// style
import './Alert.scss';

class Alert extends React.PureComponent {
  static propTypes = {
    app: PropTypes.object,
    hideAlert: PropTypes.func,
    isShowClose: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      message: '',
      type: '',
      isShowClose: false,
    };
    // bind
    this.handleShowAlert = ::this.handleShowAlert;
  }

  componentWillReceiveProps(nextProps) {
    this.handleShowAlert(nextProps);
  }

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

  configDefault = {
    isShow: false,
    message: '',
    timeOut: 5000,
    type: '',
    isShowClose: false,
    callBack: () => {},
  }

  handleShowAlert(props) {
    const { configAlert } = props.app;
    const config = Object.assign({}, this.configDefault, configAlert);
    if (config.isShow && config.timeOut) {
      setTimeout(() => {
        this.props.hideAlert();
        // call back
        config.callBack();
      }, config.timeOut);
    }
    this.setState({ ...config });
  }

  render() {
    const {
      isShow, type, message, isShowClose,
    } = this.state;
    const tyleClassName = this.getTypeClass(type);
    if (!isShow) return null;
    return (
      <div className={`alert alerts animated ${tyleClassName} ${isShow && 'slideInDown'}`} role="alert">
        {
          isShowClose && (
            <button type="button" className="close" onClick={() => this.setState({ isShow: false })}>
              <span>&times;</span>
            </button>
          )
        }
        {message}
      </div>
    );
  }
}

const mapState = state => ({
  app: state.app,
});

const mapDispatch = ({
  hideAlert,
});

export default connect(mapState, mapDispatch)(Alert);
