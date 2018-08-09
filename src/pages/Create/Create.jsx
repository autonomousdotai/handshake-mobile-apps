import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { HANDSHAKE_ID, HANDSHAKE_NAME, HANDSHAKE_ID_DEFAULT } from '@/constants';
import Helper from '@/services/helper';
// components
import { Grid, Row, Col } from 'react-bootstrap';
// import SearchBar from '@/components/core/controls/SearchBar';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';
import Dropdown from '@/components/core/controls/Dropdown';

import './Create.scss';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
//
const CreatePromise = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/promise/Create/Promise')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

//
const CreateBetting = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/betting/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

const CreateBettingEvent = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/betting-event/Create/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

//
const CreateExchange = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/exchange/Create/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

const CreateExchangeLocal = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/exchange/Create/CreateLocal.jsx')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

//
const CreateSeed = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/seed/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

//
const CreateWalletTransfer = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/wallet/Create/Transfer')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

const CreateWalletReceive = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/wallet/Create/Receive')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

const CreateYourOwnMarket = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/pages/CreateMarket/CreateMarket')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

const maps = {
  [HANDSHAKE_ID.PROMISE]: CreatePromise,
  [HANDSHAKE_ID.BETTING]: CreateBetting,
  [HANDSHAKE_ID.BETTING_EVENT]: CreateBettingEvent,
  [HANDSHAKE_ID.EXCHANGE]: CreateExchange,
  [HANDSHAKE_ID.EXCHANGE_LOCAL]: CreateExchangeLocal,
  [HANDSHAKE_ID.SEED]: CreateSeed,
  [HANDSHAKE_ID.WALLET_TRANSFER]: CreateWalletTransfer,
  [HANDSHAKE_ID.WALLET_RECEIVE]: CreateWalletReceive,
  [HANDSHAKE_ID.CREATE_EVENT]: CreateYourOwnMarket,
};

class Create extends React.Component {
  static propTypes = {
    isBannedCash: PropTypes.bool.isRequired,
    isBannedPrediction: PropTypes.bool.isRequired,
    isBannedChecked: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    let seletedId = HANDSHAKE_ID_DEFAULT;
    // get default
    let { id } = Helper.getQueryStrings(window.location.search);
    id = parseInt(id, 10);
    if (id && Object.values(HANDSHAKE_ID).indexOf(id) !== -1) {
      seletedId = id;
    }
    this.state = {
      seletedId,
      isLoading: false,
      isBannedCash: this.props.isBannedCash,
      isBannedPrediction: this.props.isBannedPrediction,
      isBannedChecked: this.props.isBannedChecked,
    };
    // bind
    this.handshakeChange = this.handshakeChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isBannedCash !== prevState.isBannedCash) {
      return { isBannedCash: nextProps.isBannedCash };
    }
    if (nextProps.isBannedPrediction !== prevState.isBannedPrediction) {
      return {
        isBannedPrediction: nextProps.isBannedPrediction,
        seletedId: nextProps.isBannedPrediction ? HANDSHAKE_ID.EXCHANGE : HANDSHAKE_ID.BETTING, // select exchange
      };
    }
    if (nextProps.isBannedChecked !== prevState.isBannedChecked) {
      return { isBannedChecked: nextProps.isBannedChecked };
    }
    if (nextProps.isBannedPrediction && nextProps.isBannedChecked) {
      return { isLoading: false };
    }
    return null;
  }

  get handshakeList() {
    const handshakes = Object.entries(HANDSHAKE_NAME).map(([key, value]) => {
      const currentKey = parseInt(key, 10);
      if ((this.state.isBannedCash || this.props.firebaseApp.config?.maintainChild?.exchange) && (currentKey === HANDSHAKE_ID.EXCHANGE || currentKey === HANDSHAKE_ID.EXCHANGE_LOCAL)) {
        return null;
      }
      if ((this.state.isBannedPrediction || this.props.firebaseApp.config?.maintainChild?.betting) && (currentKey === HANDSHAKE_ID.BETTING || currentKey === HANDSHAKE_ID.BETTING_EVENT)) {
        return null;
      }
      return {
        id: parseInt(key, 10),
        value: value.name,
        priority: value.priority,
      };
    }).filter(a => a);
    if (handshakes.length && !handshakes.filter(item => item.id === this.state.seletedId).length) {
      // console.log('create page - handshakeList - set seletedId at notfound item', handshakes[0].id);
      this.setState({ seletedId: handshakes[0].id });
    }
    return [
      ...handshakes.sort((x, y) => x.priority > y.priority),
      // {
      //   id: -1,
      //   value: 'COMING SOON: Create a prediction market',
      //   className: 'disable',
      //   disableClick: true,
      // },
    ];
  }

  handshakeChange({ id }) {
    this.setState({ seletedId: id });
  }

  setLoading = (loadingState) => {
    this.setState({ isLoading: loadingState });
  }

  render() {
    const { seletedId } = this.state;
    const CreateComponent = maps[seletedId];
    // console.log('create page - render - seletedId', seletedId);
    return (
      <React.Fragment>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <Grid className="create-page">
          <Row>
            <Col md={12}>
              <Dropdown
                placeholder="Select an mission"
                defaultId={seletedId}
                source={this.handshakeList}
                onItemSelected={this.handshakeChange}
                hasSearch
              />
              {/* <SearchBar
                suggestions={this.handshakeList}
                onSuggestionSelected={this.handshakeChange}
                inputSearchDefault={HANDSHAKE_NAME[seletedId].name}
              /> */}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <CreateComponent {...this.props} setLoading={this.setLoading} />
            </Col>
          </Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default connect(state => ({
  firebaseApp: state.firebase.data,
  isBannedCash: state.app.isBannedCash,
  isBannedPrediction: state.app.isBannedPrediction,
  isBannedChecked: state.app.isBannedChecked,
}))(Create);
