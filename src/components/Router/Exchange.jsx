import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';
import { URL } from '@/constants';
import { setHeaderTitle, clearHeaderRight, clearHeaderLeft, hideHeader } from '@/reducers/app/action';

const Exchange = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Exchange/Exchange')}>{Component => <Component {...props} />}</DynamicImport>);
const Page404 = props => (<DynamicImport isNotFound loading={Loading} load={() => import('@/pages/Error/Page404')}>{Component => <Component {...props} />}</DynamicImport>);

const routerMap = [
  { path: URL.HANDSHAKE_CASH, component: Exchange },
  { path: URL.HANDSHAKE_ATM, component: Exchange },
  { path: URL.HANDSHAKE_PREDICTION, component: Exchange },
  { path: URL.HANDSHAKE_EXCHANGE, component: Exchange },
  { path: URL.HANDSHAKE_PEX, component: Exchange },
];

class ExchangeRouter extends React.Component {
  static propTypes = {
    setHeaderTitle: PropTypes.func.isRequired,
    clearHeaderRight: PropTypes.func.isRequired,
    clearHeaderLeft: PropTypes.func.isRequired,
    hideHeader: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.props.clearHeaderRight();
    this.props.clearHeaderLeft();
    // this.props.setHeaderTitle('Exchange');
    this.props.hideHeader();
  }

  render() {
    return (
      <Switch>
        {routerMap.map(route => <Route key={route.path} exact {...route} />)}
        <Page404 />
      </Switch>
    );
  }
}

export default connect(null, ({ setHeaderTitle, clearHeaderRight, clearHeaderLeft, hideHeader }))(ExchangeRouter);
