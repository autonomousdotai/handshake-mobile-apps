import React, { Component } from 'react';
// import InternalAdmin from '@/pages/InternalAdmin/InternalAdmin';
import AdminIDVerification, { STATUS } from '@/pages/Admin/AdminIDVerification';
import { EXCHANGE_ACTION, URL } from '@/constants';
import InternalAdmin from '@/pages/InternalAdmin/InternalAdmin';
import queryString from 'query-string';
import Login from '@/components/handshakes/betting-event/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './styles.scss';

// const AdminIDVerification = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Admin/AdminIDVerification')}>{ ComponentLoaded => <ComponentLoaded {...props} />}</DynamicImport>);
// const InternalAdmin = props => (<DynamicImport loading={Loading} load={() => import('@/pages/InternalAdmin/InternalAdmin')}>{ ComponentLoaded => <ComponentLoaded {...props} />}</DynamicImport>);

const scopeCss = (className) => `internal-admin-${className}`;

const menus = {
  idVerificationProcessing: {
    name: 'Admin - Processing',
    components: AdminIDVerification,
  },
  idVerificationVerified: {
    name: 'Admin - Verified',
    components: AdminIDVerification,
    params: { status: STATUS.VERIFIED },
  },
  idVerificationRejected: {
    name: 'Admin - Rejected',
    components: AdminIDVerification,
    params: { status: STATUS.REJECTED },
  },
  buyCoinBank: {
    name: 'Buy Coin - BANK',
    components: InternalAdmin,
    params: { type: 'bank', action: EXCHANGE_ACTION.BUY },
  },
  buyCoinCod: {
    name: 'Buy Coin - COD',
    components: InternalAdmin,
    params: { type: 'cod', action: EXCHANGE_ACTION.BUY },
  },
  sellCoinBank: {
    name: 'Sell Coin - BANK',
    components: InternalAdmin,
    params: { type: 'bank', action: EXCHANGE_ACTION.SELL },
  },
};

class InternalAdminDashboard extends Component {
  constructor() {
    super();
    this.token = this.getAdminHash() || '';
    this.state = {
      selectedMenuId: 'idVerificationProcessing',
      queryParams: {},
      queryTab: null,
    };
  }

  componentDidMount() {
    if (this.checkAuth()) {
      this.queryHandler();
    }
  }

  getAdminHash() {
    return sessionStorage.getItem('admin_hash');
  }

  onMenuSelect = (idMenu) => {
    if (menus[idMenu]) {
      this.setState({ selectedMenuId: idMenu });
    }
  }

  checkAuth = () => {
    console.log(this.token);
    if (this.token.length > 0) {
      return true;
    }
    return false;
  }

  queryHandler = () => {
    const { tab, ...queryParams } = this.parseQuery();
    if (tab) {
      this.onMenuSelect(tab);
      this.setState({ queryTab: tab, queryParams });
    }
  }

  parseQuery = () => {
    return queryString.parse(window?.location?.search) || {};
  }

  reload = () => {
    window?.location?.reload && window?.location?.reload();
  }

  renderBody = () => {
    const { selectedMenuId, queryTab, queryParams } = this.state;
    const menuData = menus[selectedMenuId];
    if (!menuData) return null;
    const { components: MyComponent, params } = menuData;
    return <MyComponent {...params} {... queryTab === selectedMenuId ? queryParams : {}} />;
  }

  render() {
    if (!this.checkAuth()) {
      return <Login onLoggedIn={this.reload} />;
    }
    return (
      <main>
        <Header title={menus[this.state.selectedMenuId]?.name} />
        <Sidebar menus={menus} selectedMenuId={this.state.selectedMenuId} onMenuSelect={this.onMenuSelect} />
        <div className={scopeCss('container')}>
          {this.renderBody()}
        </div>
      </main>
    );
  }
}

export default InternalAdminDashboard;
