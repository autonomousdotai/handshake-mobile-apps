import React, { Component } from 'react';
// import InternalAdmin from '@/pages/InternalAdmin/InternalAdmin';
import AdminIDVerification, { STATUS } from '@/pages/Admin/AdminIDVerification';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './styles.scss';
import { EXCHANGE_ACTION } from '@/constants';
import InternalAdmin from '@/pages/InternalAdmin/InternalAdmin';

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
    this.state = {
      selectedMenuId: 'idVerificationProcessing',
    };
  }

  onMenuSelect = (idMenu) => {
    this.setState({ selectedMenuId: idMenu });
  }

  renderBody = () => {
    const { selectedMenuId } = this.state;
    const menuData = menus[selectedMenuId];
    if (!menuData) return null;
    const { components: MyComponent, params } = menuData;
    return <MyComponent {...params} />;
  }

  render() {
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
