import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Route, Switch} from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';
import {URL} from '@/constants';
import {clearHeaderLeft, clearHeaderRight, hideHeader, setHeaderTitle} from '@/reducers/app/action';

const BuyCC = props => (<DynamicImport loading={Loading} load={() => import('@/components/handshakes/exchange/Feed/FeedCreditCard')}>{Component => <Component {...props} />}</DynamicImport>);
const Page404 = props => (<DynamicImport isNotFound loading={Loading} load={() => import('@/pages/Error/Page404')}>{Component => <Component {...props} />}</DynamicImport>);
const PageNotSupport = props => (<DynamicImport isNotFound loading={Loading} load={() => import('@/pages/Error/PageNotSupport')}>{Component => <Component {...props} />}</DynamicImport>);

const routerMap = [
  { path: URL.BUY_BY_CC_URL, component: BuyCC },
];

class BuyCCRouter extends React.Component {
  static propTypes = {
    setHeaderTitle: PropTypes.func.isRequired,
    clearHeaderRight: PropTypes.func.isRequired,
    hideHeader: PropTypes.func.isRequired,
    clearHeaderLeft: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.props.setHeaderTitle('Buy by Credit Card');
    this.props.clearHeaderRight();
    this.props.clearHeaderLeft();
    // this.props.hideHeader();
  }

  render() {
    if (this.props.isBannedIp) return <PageNotSupport/>;
    return (
      <Switch>
        {routerMap.map(route => <Route key={route.path} exact path={route.path} component={route.component} />)}
        <Page404 />
      </Switch>
    );
  }
}

export default connect(state => ({ isBannedIp: state.app.isBannedIp }), ({
  setHeaderTitle, clearHeaderRight, clearHeaderLeft, hideHeader,
}))(BuyCCRouter);
