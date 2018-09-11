import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';
import { URL } from '@/constants';
import { setHeaderTitle, clearHeaderLeft, clearHeaderRight, showHeader } from '@/reducers/app/action';

const Shop = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Shop/Shop')}>{Component => <Component {...props} />}</DynamicImport>);
const OrderConfirm = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Shop/Confirm')}>{Component => <Component {...props} />}</DynamicImport>);
const ShopDetail = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Shop/ShopDetail')}>{Component => <Component {...props} />}</DynamicImport>);
const Page404 = props => (<DynamicImport isNotFound loading={Loading} load={() => import('@/pages/Error/Page404')}>{Component => <Component {...props} />}</DynamicImport>);

const routerMap = [
  { path: URL.SHOP_URL_INDEX, component: Shop },
  { path: URL.SHOP_URL_CONFIRM, component: OrderConfirm },
  { path: URL.SHOP_URL_DETAIL, component: ShopDetail },
];

class ShopRouter extends React.Component {
  static propTypes = {
    setHeaderTitle: PropTypes.func.isRequired,
    clearHeaderLeft: PropTypes.func.isRequired,
    clearHeaderRight: PropTypes.func.isRequired,
    showHeader: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.props.setHeaderTitle('Shop');
    this.props.clearHeaderRight();
    this.props.clearHeaderLeft();
    this.props.showHeader();
  }

  render() {
    return (
      <Switch>
        {routerMap.map(route => <Route key={route.path} exact path={route.path} component={route.component} />)}
        <Page404 />
      </Switch>
    );
  }
}

export default connect(null, ({
  setHeaderTitle, clearHeaderRight, clearHeaderLeft, showHeader,
}))(ShopRouter);
