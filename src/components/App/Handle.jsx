import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
// contants
import { APP, API_URL } from '@/constants';
// services
import local from '@/services/localStore';
// actions
import { showAlert } from '@/reducers/app/action';
import { signUp, fetchProfile, authUpdate, getFreeETH } from '@/reducers/auth/action';
import { getUserProfile } from '@/reducers/exchange/action';
import { createMasterWallets } from '@/reducers/wallet/action';
// components
import { MasterWallet } from '@/models/MasterWallet';
import Loading from '@/components/core/presentation/Loading';
import Router from '@/components/Router/Router';

class Handle extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    //
    firebase: PropTypes.object.isRequired,
    //
    showAlert: PropTypes.func.isRequired,
    //
    signUp: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    authUpdate: PropTypes.func.isRequired,
    getUserProfile: PropTypes.func.isRequired,
    //
    getFreeETH: PropTypes.func.isRequired,
    refer: PropTypes.string,
  }

  static defaultProps = {
    refer: '',
  }

  constructor(props) {
    super(props);

    this.checkRegistry = ::this.checkRegistry;
    this.authSuccess = ::this.authSuccess;
    this.firebase = ::this.firebase;
    this.notification = ::this.notification;
    this.updateRewardAddress = ::this.updateRewardAddress;

    this.state = {
      auth: this.props.auth,
    };
  }

  componentDidMount() {
    this.checkRegistry();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.updatedAt !== prevState.auth.updatedAt) {
      return { auth: nextProps.auth };
    }
    return null;
  }

  // wallet
  getFreeETH() {
    const wallet = MasterWallet.getWalletDefault('ETH');
    this.props.getFreeETH({// todo remove xxxxxx:
      PATH_URL: `/user/free-rinkeby-eth?address=xxxxxx${wallet.address}`,
      METHOD: 'POST',
      successFn: () => {
        this.setState({ isLoading: false, loadingText: '' });
        // run cron alert user when got 1eth:
        this.timeOutCheckGotETHFree = setInterval(() => {
          wallet.getBalance().then((result) => {
            if (result > 0) {
              this.porps.showAlert({
                message: <div className="text-center">You have ETH! Now you can play for free on the Ninja testnet.</div>,
                timeOut: false,
                isShowClose: true,
                type: 'success',
                callBack: () => {},
              });
              // notify user:
              clearInterval(this.timeOutCheckGotETHFree);
            }
          });
        }, 20 * 60 * 1000); // 20'
      },
      errorFn: () => { this.setState({ isLoading: false, loadingText: '' }); },
    });
  }

  updateRewardAddress() {
    console.log('app - handle - wallet - updateRewardAddress');
    const walletReward = MasterWallet.getShurikenWalletJson();
    const data = new FormData();
    data.append('reward_wallet_addresses', walletReward);
    this.props.authUpdate({
      PATH_URL: 'user/profile',
      data,
      METHOD: 'POST',
      successFn: (res) => {
        console.log('app - handle - wallet - success - ', res);
      },
      errorFn: (e) => {
        console.log('app - handle - wallet - error - ', e);
      },
    });
  }
  // /wallet

  // main
  checkRegistry() {
    const token = local.get(APP.AUTH_TOKEN);

    if (token) {
      this.authSuccess();
    } else {
      this.props.signUp({
        PATH_URL: `user/sign-up${this.props.refer ? `?ref=${this.props.refer}` : ''}`,
        METHOD: 'POST',
        successFn: () => {
          this.authSuccess();
        },
      });
    }
  }

  authSuccess() {
    this.props.fetchProfile({
      PATH_URL: 'user/profile',
      errorFn: (res) => {
        if (!process.env.isProduction) {
          if (res.message === 'Invalid user.') {
            local.remove(APP.AUTH_TOKEN);
            this.checkRegistry();
          }
        } else {
          this.props.showAlert({
            message: (
              <div className="text-center">
                Have something wrong with your profile, please contact supporters
              </div>
            ),
            timeOut: false,
            isShowClose: true,
            type: 'danger',
            callBack: () => {},
          });
        }
      },
      successFn: () => {
        // exchange
        this.props.getUserProfile({ PATH_URL: API_URL.EXCHANGE.GET_USER_PROFILE });

        // wallet
        const listWallet = MasterWallet.getMasterWallet();
        // console.log('app - handle - wallet - listWallet - ', listWallet);

        if (listWallet === false) {
          this.setState({ loadingText: 'Creating your local wallets' });
          createMasterWallets().then(() => {
            this.setState({ isLoading: false, loadingText: '' });
            this.updateRewardAddress();
            // if (!process.env.isProduction) {
            //   const wallet = MasterWallet.getWalletDefault('ETH');
            //   this.props.getFreeETH({
            //     PATH_URL: `/user/free-rinkeby-eth?address=${wallet.address}`,
            //     METHOD: 'POST',
            //   });
            // }
          });
        } else {
          const shuriWallet = MasterWallet.getShurikenWalletJson();
          // console.log('app - handle - wallet - shuriWallet - ', shuriWallet);
          if (shuriWallet === false) {
            MasterWallet.createShuriWallet();
            this.updateRewardAddress();
          }
        }

        // core
        this.firebase();
        this.notification();
        // /core
      },
    });
  }
  // /main

  firebase() {
    console.log('app - handle - core - firebase');
    this.props.firebase.watchEvent('value', `/users/${this.state.auth.profile.id}`);
    this.props.firebase.watchEvent('value', `/config`);
  }

  notification() {
    console.log('app - handle - core - notification');
    try {
      const messaging = this.props.firebase.messaging();
      messaging
        .requestPermission()
        .then(() => messaging.getToken())
        .catch(e => console.log(e))
        .then((notificationToken) => {
          if (notificationToken) {
            const data = new FormData();
            data.append('fcm_token', notificationToken);
            this.props.authUpdate({
              PATH_URL: 'user/profile',
              data,
              METHOD: 'POST',
            });
          }
        })
        .catch(e => console.log(e));
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.state.isLoading) {
      return <Loading message={this.state.loadingText} />;
    }
    return (
      <Router />
    );
  }
}

export default compose(withFirebase, connect(state => ({
  auth: state.auth,
  app: state.app,
}), {
  showAlert,
  signUp,
  fetchProfile,
  authUpdate,
  getUserProfile,
  getFreeETH,
}))(Handle);
