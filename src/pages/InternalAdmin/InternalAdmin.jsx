/* eslint react/sort-comp:0 */
/* eslint camelcase:0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { API_URL, URL } from '@/constants';
import debounce from '@/utils/debounce';
import { loadCashOrderList, sendCashOrder, reset } from '@/reducers/internalAdmin/action';
import './InternalAdmin.scss';
import { FormattedDate } from 'react-intl';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import Helper from '@/services/helper';
import { formatMoneyByLocale } from '@/services/offer-util';
import { withRouter } from 'react-router-dom';

const STATUS = {
  pending: {
    id: 'pending',
    name: 'Created',
  },
  processing: {
    id: 'processing',
    name: 'Processing',
  },
  fiat_transferring: {
    id: 'fiat_transferring',
    name: 'Fiat transferring',
  },
  transferring: {
    id: 'transferring',
    name: 'Sending',
  },
  success: {
    id: 'success',
    name: 'Sent',
  },
  cancelled: {
    id: 'cancelled',
    name: 'Canceled',
  },
  rejected: {
    id: 'rejected',
    name: 'Rejected',
  },
  transfer_failed: {
    id: 'transfer_failed',
    name: 'Failed',
  },
  expired: {
    id: 'expired',
    name: 'Expired',
  },
};

const backupScroll = window.onscroll;
const DEFAULT_TYPE = Object.values(STATUS)[0].id;

class InternalAdmin extends Component {
  constructor() {
    super();

    this.token = this.getAdminHash() || '';
    this.state = {
      type: DEFAULT_TYPE,
      isFinished: false,
      page: null,
      type_order: '',
      ref_code: '',
      login: this.token.length > 0,
    };

    this.send = :: this.send;
    this.loadOrderList = :: this.loadOrderList;
    this.setupInitifyLoad = :: this.setupInitifyLoad;
    this.onSuccess = :: this.onSuccess;
    this.autoLoadMore = debounce(:: this.autoLoadMore, 1000);
  }

  componentDidMount() {
    if (this.state.login) {
      const type = this.props.type || this.props?.match?.params?.type;
      const searchParams = Helper.getQueryStrings(window.location.search);
      const refCode = this.props.refCode || searchParams?.ref_code;
      this.setState({ type_order: type, ref_code: refCode }, () => {
        this.loadOrderList();
      });

      this.setupInitifyLoad();
    } else {
      this.props.history.push(`${URL.ADMIN_ID_VERIFICATION}?redirect=${window.location.pathname}`);
    }
    return null;
  }

  resetState = (onDone) => {
    const state = {
      type: DEFAULT_TYPE,
      isFinished: false,
      page: null,
      type_order: '',
      ref_code: '',
      login: this.token.length > 0,
    };
    this.setState(state, onDone);
  }

  getAdminHash() {
    return sessionStorage.getItem('admin_hash');
  }

  componentWillUnmount() {
    window.onscroll = backupScroll;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.type !== this.props.type) {
      this.props.reset();
      this.resetState(() => {
        const searchParams = Helper.getQueryStrings(window.location.search);
        const refCode = this.props.refCode || searchParams?.ref_code;
        this.setState({ type_order: nextProps.type, ref_code: refCode }, () => {
          this.loadOrderList();
          this.setupInitifyLoad();
        });
      });
    }
    if (nextProps.orderList && JSON.stringify(nextProps.orderList) !== JSON.stringify(this.props.orderList)) {
      // this.resetTable();
    }
  }

  resetTable = () => {
    console.log('this.refs.table', this.refs.table);
    if (this.refs.table) {
      this.refs.table?.refresh();
    }
  }

  autoLoadMore() {
    if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 80)) { // 80 is distance from this to top of window
      this.loadOrderList();
    }
  }

  setupInitifyLoad() {
    window.onscroll = this.autoLoadMore;
  }

  getAmount(order = {}) {
    return {
      full: `${formatMoneyByLocale(order.fiat_local_amount, order.fiat_local_currency, 2)} ${order.fiat_local_currency}`,
      amount: order.fiat_local_amount,
    };
  }

  getCoin(order = {}) {
    return `${order.amount} ${order.currency}`;
  }

  getStatus(order = {}) {
    return STATUS[order.status]?.name || '---';
  }

  isLastType() {
    const len = Object.keys(STATUS).length;
    const index = Object.values(STATUS).findIndex(item => item.id === this.state.type);
    if (index === (len - 1)) {
      return true;
    }
    return false;
  }

  onSuccess(res) {
    if (res?.can_move === false) {
      // if this is last of type, jod done!
      if (this.isLastType()) {
        this.setState({ isFinished: true });
        return;
      }

      // load next type of order
      const types = Object.keys(STATUS);
      const foundIndex = types.indexOf(this.state.type);
      if (types[foundIndex + 1]) {
        this.setState({ type: types[foundIndex + 1], page: null }, this.autoLoadMore);
      }
    } else {
      this.setState({ page: res?.page }, this.autoLoadMore);
    }
  }

  loadOrderList(status = this.state.type) {
    if (this.state.isFinished) {
      return;
    }

    const qs = { status };
    if (this.state.page) {
      qs.page = this.state.page;
    }

    if (this.state.type_order) {
      qs.type = this.state.type_order;
    }

    if (this.state.ref_code) {
      qs.ref_code = this.state.ref_code;
    }

    this.props.loadCashOrderList({
      PATH_URL: API_URL.INTERNAL.GET_COIN_ORDER,
      qs,
      more: {
        types: this.props.type,
      },
      successFn: this.onSuccess,
    });
  }

  checkAuth() {
    const superKey = process.env.withdrawSuperKey;
    const userKey = this.props?.match?.params?.superKey;
    return superKey === userKey;
  }

  send(order = {}) {
    this.props.sendCashOrder({
      PATH_URL: `${API_URL.INTERNAL.GET_COIN_ORDER}/${order.id}`,
      METHOD: 'POST',
      successFn: (res) => {
      },
    });
  }

  process(order = {}) {
    this.props.sendCashOrder({
      PATH_URL: `${API_URL.INTERNAL.GET_COIN_ORDER}/${order.id}/pick`,
      METHOD: 'PUT',
    });
  }

  reject(order = {}) {
    this.props.sendCashOrder({
      PATH_URL: `${API_URL.INTERNAL.GET_COIN_ORDER}/${order.id}/reject`,
      METHOD: 'PUT',
    });
  }

  renderActionBtn(order = {}) {
    let result = null;
    switch (order.type) {
      case 'bank': {
        if (order.status === STATUS.fiat_transferring.id) {
          result = (
            <button onClick={() => this.send(order)} className="btn btn-primary">
              Send
            </button>
          );
        } else if (order.status === STATUS.transfer_failed.id) {
          result = (
            <button onClick={() => this.send(order)} className="btn btn-primary">
              ReSend
            </button>
          );
        }
        break;
      }
      case 'cod': {
        if (order.status === STATUS.pending.id) {
          result = (
            <button onClick={() => this.process(order)} className="btn btn-primary">
              Process
            </button>
          );
        } else if (order.status === STATUS.processing.id) {
          result = (
            <div>
              <button onClick={() => this.send(order)} className="btn btn-primary">
                Send
              </button>
              &nbsp;&nbsp;&nbsp;
              <button onClick={() => this.reject(order)} className="btn btn-primary">
                Reject
              </button>
            </div>
          );
        } else if (order.status === STATUS.transfer_failed.id) {
          result = (
            <div>
              <button onClick={() => this.send(order)} className="btn btn-primary">
                ReSend
              </button>
            </div>
          );
        }

        break;
      }
      default: {

      }
    }

    return result;
  }

  ellipsisText(text = '') {
    let newText = '';
    if (text.length >= 20) {
      newText = `${text.substr(0, 4)}...${text.substr(-6)}`;
    }

    return newText;
  }

  render() {
    const { orderList } = this.props;
    const { isFinished, type_order } = this.state;
    const typeShowInfo = 'cod';

    console.log('render', orderList);

    const columns = [{
      dataField: 'id',
      text: 'ID',
      hidden: true,
    }, {
      dataField: 'created_at',
      text: 'Created Date',
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (<FormattedDate
          value={new Date(cell)}
          year="numeric"
          month="long"
          day="2-digit"
          hour="2-digit"
          minute="2-digit"
        />);
      },
    }, {
      dataField: 'address',
      text: 'Wallet Address',
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return this.ellipsisText(cell);
      },
    }, {
      dataField: 'user_info.address',
      text: 'Address',
      hidden: type_order !== typeShowInfo,
    }, {
      dataField: 'user_info.phone',
      text: 'Phone',
      hidden: type_order !== typeShowInfo,
    }, {
      dataField: 'user_info.noteAndTime',
      text: 'Note',
      hidden: type_order !== typeShowInfo,
    }, {
      dataField: 'amount',
      text: 'Amount',
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return this.getAmount(row)?.full;
      },
    }, {
      dataField: 'coin',
      text: 'Coin',
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return this.getCoin(row);
      },
    }, {
      dataField: 'ref_code',
      text: 'Code',
      filter: textFilter(),
    }, {
      dataField: 'status',
      text: 'Status',
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return this.getStatus(row);
      },
    }, {
      dataField: 'action',
      text: 'Action',
      isDummyField: true,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        const order = orderList[rowIndex];
        console.log('action order', row, order);
        return this.renderActionBtn(row);
      },
    },
    ];

    return (
      <BootstrapTable
        ref="table"
        keyField="id"
        data={orderList}
        columns={columns}
        filter={filterFactory()}
        bordered={false}
        noDataIndication="No record"
        striped
        hover
        condensed
      />

      /* <div>
        <table>
          <thead>
            <tr>
              <th>Created Date</th>
              <th>Wallet Address</th>
              <th>Name</th>
              {type_order === typeShowInfo && <th>Address</th>}
              {type_order === typeShowInfo && <th>Phone</th>}
              {type_order === typeShowInfo && <th>Note</th>}
              <th>Amount</th>
              <th>Coin</th>
              <th>Code</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            { orderList.length === 0 &&
              <tr>
                <td colSpan="7"><p>No record</p></td>
              </tr>
            }
            {
              orderList.map(order => (
                <tr key={order.id}>
                  <td><FormattedDate
                    value={new Date(order.created_at)}
                    year="numeric"
                    month="long"
                    day="2-digit"
                    hour="2-digit"
                    minute="2-digit"
                  /></td>
                  <td>{this.ellipsisText(order.address)}</td>
                  <td>{order?.user_info?.name || '---'}</td>
                  {type_order === typeShowInfo && <td>{order?.user_info?.address || '---'}</td>}
                  {type_order === typeShowInfo && <td>{order?.user_info?.phone || '---'}</td>}
                  {type_order === typeShowInfo && <td>{order?.user_info?.noteAndTime || '---'}</td>}
                  <td>{this.getAmount(order)?.full}</td>
                  <td>{this.getCoin(order)}</td>
                  <td>{order.ref_code}</td>
                  <td>{this.getStatus(order)}</td>
                  <td>{this.renderActionBtn(order)}</td>
                </tr>
              ))
            }
            { isFinished &&
              <tr>
                <td colSpan="7"><p>No more order</p></td>
              </tr>}
          </tbody>
        </table>
      </div> */
    );
  }
}

InternalAdmin.propTypes = {
  orderList: PropTypes.array,
  match: PropTypes.object.isRequired,
  loadCashOrderList: PropTypes.func.isRequired,
  sendCashOrder: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  type: PropTypes.string,
  refCode: PropTypes.string,
};

InternalAdmin.defaultProps = {
  orderList: [],
  page: null,
  type: null,
  refCode: null,
};

const mapState = (state) => {
  return {
    orderList: state.internalAdmin.orderList,
    page: state.internalAdmin.page,
  };
};

export default connect(mapState, { loadCashOrderList, sendCashOrder, reset })(withRouter(InternalAdmin));
