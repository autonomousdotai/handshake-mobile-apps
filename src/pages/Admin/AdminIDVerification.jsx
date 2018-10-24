import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showAlert } from '@/reducers/app/action';
import { loadIDVerificationDocuments, updateIDVerificationDocument } from '@/reducers/admin/action';
import Image from '@/components/core/presentation/Image';
import { API_URL, URL } from '@/constants';
import Login from '@/components/handshakes/betting-event/Login';
import moment from 'moment';
import { Table, Button } from 'react-bootstrap';

import './Admin.scss';
import Helper from '@/services/helper';

const IMAGE_BASE_URL = process.env.CDN_URL;
const DOCUMENT_TYPES = [
  'Passport',
  'Driver License',
  'Goverment ID Card',
];

class AdminIDVerification extends React.Component {
  static propTypes = {
    loadIDVerificationDocuments: PropTypes.func.isRequired,
    updateIDVerificationDocument: PropTypes.func.isRequired,
    login: PropTypes.bool,
    showAlert: PropTypes.func.isRequired,
  }

  static defaultProps = {
    login: false,
  }

  constructor(props) {
    super(props);
    this.token = this.getAdminHash() || '';
    this.state = {
      documents: [],
      login: this.token.length > 0,
      actions: {},
    };
    this.documentRef = {};
  }

  componentDidMount() {
    if (this.state.login) {
      this.fetchDocuments();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { login } = nextProps;
    const newLogin = login === true ? login : this.state.login;
    this.setState({
      login: newLogin,
    }, () => {
      const { redirect } = Helper.getQueryStrings(window.location.search);
      if (newLogin && redirect) {
        this.props.history.push(`${redirect}`);
      } else {
        setTimeout(() => {
          this.fetchDocuments();
        }, 500);
      }
    });
  }

  getAdminHash() {
    return sessionStorage.getItem('admin_hash');
  }

  fetchDocuments() {
    if (!this.state.login) {
      return;
    }
    const { uid } = Helper.getQueryStrings(window.location.search);
    this.token = this.token || this.getAdminHash() || '';
    this.props.loadIDVerificationDocuments({
      PATH_URL: `${API_URL.ID_VERIFICATION.LIST_DOCUMENTS}${ uid ? '?uid=' + uid : '' }`,
      headers: { AdminHash: this.token },
      successFn: (response) => {
        if (response.status === 1) {
          this.setState({ documents: response.data });
        }
      },
    });
  }

  approve(itemId) {
    this.setState((prevState) => {
      prevState.actions[itemId] = 1;
      return {
        actions: prevState.actions,
      };
    });
  }

  reject(itemId) {
    this.setState((prevState) => {
      prevState.actions[itemId] = -1;
      return {
        actions: prevState.actions,
      };
    });
  }

  confirm(itemId) {
    const { actions } = this.state;
    const status = actions[itemId];
    if (status) {
      this.updateStatus(itemId, status);
    }
  }

  cancel(itemId) {
    this.setState((prevState) => {
      prevState.actions[itemId] = undefined;
      return {
        actions: prevState.actions,
      };
    });
  }

  updateStatus(itemId, status) {
    const data = new FormData();
    data.append('id', itemId);
    data.append('status', status);
    this.props.updateIDVerificationDocument({
      PATH_URL: `${API_URL.ID_VERIFICATION.UPDATE_STATUS}`,
      METHOD: 'POST',
      headers: { AdminHash: this.token },
      data,
      successFn: (response) => {
        if (response.status === 1) {
          this.documentRef[itemId].style.display = 'none';
          this.props.showAlert({
            message: <div className="text-center">Successfully {status === 1 ? 'Approved' : 'Rejected'}</div>,
            timeOut: 3000,
            type: 'success',
          });
        } else {
          this.props.showAlert({
            message: <div className="text-center">Cannot {status === 1 ? 'Approve' : 'Rejecte'}. Please try again</div>,
            timeOut: 3000,
            type: 'danger',
          });
        }
        this.cancel(itemId);
      },
      errorFn: () => {
        this.props.showAlert({
          message: <div className="text-center">Cannot {status === 1 ? 'Approve' : 'Rejecte'}. Please try again</div>,
          timeOut: 3000,
          type: 'danger',
        });
        this.cancel(itemId);
      },
    });
  }

  render() {
    const { documents, login } = this.state;
    return !login ?
      (<Login />) : (
        <div className="admin-id-verification">
          <Table striped condensed hover>
            <thead>
              <tr>
                <th>#</th>
                <th>UID</th>
                <th>Full Name</th>
                <th>Document Number</th>
                <th>Document Type</th>
                <th>Upgrading Level</th>
                <th>Front Image</th>
                <th>Back Image</th>
                <th>Selfie Image</th>
                <th>Upload Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((item, i) => {
                const frontImage = `${IMAGE_BASE_URL}/${item.front_image}`;
                const backImage = `${IMAGE_BASE_URL}/${item.back_image}`;
                const selfieImage = `${IMAGE_BASE_URL}/${item.selfie_image}`;
                const uploadDate = moment(item.date_modified).format('MM/DD/YYYY');

                return (
                  <tr key={`id_verification_item_${item.id}`} ref={(node) => { this.documentRef[item.id] = node; }}>
                    <td>{item.id}</td>
                    <td>{item.user_id}</td>
                    <td>{item.name}</td>
                    <td>{item.id_number}</td>
                    <td>{DOCUMENT_TYPES[item.id_type]}</td>
                    <td>{item.level + 1}</td>
                    <td><a href={frontImage} target="_blank" rel="noopener noreferrer">{item.front_image ? (<Image src={frontImage} width="200" />) : ''}</a></td>
                    <td><a href={backImage} target="_blank" rel="noopener noreferrer">{item.back_image ? (<Image src={backImage} width="200" />) : ''}</a></td>
                    <td><a href={selfieImage} target="_blank" rel="noopener noreferrer">{item.selfie_image ? (<Image src={selfieImage} width="200" />) : ''}</a></td>
                    <td>{uploadDate}</td>
                    <td>
                      <div style={this.state.actions[item.id] ? { display: 'none' } : {}}>
                        <Button bsSize="small" bsStyle="success" onClick={() => this.approve(item.id)}>Approve</Button> <Button bsSize="small" bsStyle="danger" onClick={() => this.reject(item.id)}>Reject</Button>
                      </div>
                      <div style={!this.state.actions[item.id] ? { display: 'none' } : {}}>
                        <Button bsSize="small" bsStyle="info" onClick={() => this.confirm(item.id)}>{this.state.actions[item.id] === 1 ? 'Approve' : 'Reject'} ?</Button> <Button bsSize="small" bsStyle="info" onClick={() => this.cancel(item.id)}>Cancel</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      );
  }
}

const mapState = state => ({
  login: state.admin.login,
});

const mapDispatch = ({
  loadIDVerificationDocuments,
  updateIDVerificationDocument,
  showAlert,
});

export default connect(mapState, mapDispatch)(AdminIDVerification);
