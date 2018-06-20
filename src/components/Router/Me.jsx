import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';
import { URL } from '@/constants';
import { setHeaderTitle, clearHeaderRight, clearHeaderLeft, hideHeader } from '@/reducers/app/action';

const Me = props => (
  <DynamicImport loading={Loading} load={() => import('@/pages/Me/Me')}>
    {Component => <Component {...props} />}
  </DynamicImport>
);

const MeProfile = props => (
  <DynamicImport loading={Loading} load={() => import('@/pages/Me/Profile')}>
    {Component => <Component {...props} />}
  </DynamicImport>
);

const Page404 = props => (
  <DynamicImport isNotFound loading={Loading} load={() => import('@/pages/Error/Page404')}>
    {Component => <Component {...props} />}
  </DynamicImport>
);

const routerMap = [
  { path: URL.HANDSHAKE_ME_INDEX, component: Me },
  { path: URL.HANDSHAKE_ME_PROFILE, component: MeProfile },
];

class MeRouter extends React.Component {
  static propTypes = {
    clearHeaderRight: PropTypes.func.isRequired,
    setHeaderTitle: PropTypes.func.isRequired,
    clearHeaderLeft: PropTypes.func.isRequired,
    hideHeader: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.props.setHeaderTitle('My Handshakes');
    this.props.clearHeaderRight();
    this.props.clearHeaderLeft();
    this.props.hideHeader();
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
  setHeaderTitle, clearHeaderRight, clearHeaderLeft, hideHeader,
}))(MeRouter);

