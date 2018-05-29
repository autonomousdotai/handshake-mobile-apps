import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';
import { URL } from '@/config';
import { setHeaderTitle, clearHeaderRight } from '@/reducers/app/action';

const Transaction = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Exchange/Transaction/Transaction')}>{Component => <Component {...props} />}</DynamicImport>);
const Page404 = props => (<DynamicImport isNotFound loading={Loading} load={() => import('@/pages/Error/Page404')}>{Component => <Component {...props} />}</DynamicImport>);

const routerMap = [
  { path: URL.TRANSACTION_LIST_INDEX, component: Transaction },
];

class TransactionRouter extends React.Component {
  static propTypes = {
    clearHeaderRight: PropTypes.func.isRequired,
    setHeaderTitle: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.props.setHeaderTitle('Transactions');
    this.props.clearHeaderRight();
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

export default connect(null, ({ setHeaderTitle, clearHeaderRight }))(TransactionRouter);
