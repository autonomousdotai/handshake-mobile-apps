import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';
import { URL } from '@/constants';
import { setHeaderTitle, clearHeaderRight, clearHeaderLeft, hideHeader } from '@/reducers/app/action';

const ProjectList = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Invest/ProjectList')}>{Component => <Component {...props} />}</DynamicImport>);
const ProjectDetail = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Invest/ProjectDetail')}>{Component => <Component {...props} />}</DynamicImport>);
const TraderList = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Invest/TraderList')}>{Component => <Component {...props} />}</DynamicImport>);
const TraderDetail = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Invest/TraderDetail')}>{Component => <Component {...props} />}</DynamicImport>);
const InvestingList = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Invest/InvestingList')}>{Component => <Component {...props} />}</DynamicImport>);

const Page404 = props => (<DynamicImport isNotFound loading={Loading} load={() => import('@/pages/Error/Page404')}>{Component => <Component {...props} />}</DynamicImport>);

const InvestPage = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Invest/InvestBlock')}>{Component => <Component {...props} />}</DynamicImport>);


const routerMap = [
  { path: URL.INVEST_URL, component: InvestPage },
  { path: URL.INVEST_PROJECT_LIST, component: ProjectList },
  { path: URL.INVEST_PROJECT_INFO, component: ProjectDetail },
  { path: URL.INVEST_TRADER_LIST, component: TraderList },
  { path: URL.INVEST_TRADER_INFO, component: TraderDetail },
  { path: URL.INVEST_INVESTING_LIST, component: InvestingList },
];

class InvestRouter extends React.Component {
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
    this.props.setHeaderTitle('Invest your cryptocurrency');
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

export default connect(null, ({ setHeaderTitle, clearHeaderRight, clearHeaderLeft, hideHeader }))(InvestRouter);
