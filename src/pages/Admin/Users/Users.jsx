import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showAlert } from '@/reducers/app/action';
import { loadUsers, addUpdateUser } from '@/reducers/admin/action';
import Image from '@/components/core/presentation/Image';
import { API_URL, URL } from '@/constants';
import Login from '@/components/handshakes/betting-event/Login';
import moment from 'moment';
import { Table, Button } from 'react-bootstrap';
import ModalDialog from '@/components/core/controls/ModalDialog';
import './Users.scss';
import Helper from '@/services/helper';
import createForm from '@/components/core/form/createForm'
import { fieldInput, fieldDropdown } from '@/components/core/form/customField'
import {Field, clearFields, change} from "redux-form";
import {required} from '@/components/core/form/validation'

export const STATUS = {
  ROOT: 0,
  ADMIN: 1,  
};

const nameFormAddNew = 'addNewUser';
const AddNewUserForm = createForm({ propsReduxForm: { form: nameFormAddNew, enableReinitialize: true, clearSubmitErrors: true}});


class Users extends React.Component {
  static propTypes = {
    loadUsers: PropTypes.func.isRequired,
    addUpdateUser: PropTypes.func.isRequired,
    login: PropTypes.bool,
    showAlert: PropTypes.func.isRequired,
  }

  static defaultProps = {
    login: false,    
  }

  constructor(props) {
    super(props);
    this.token = this.getAdminHash() || '';
    this.userType = this.getUserType() || 2;    
    this.userID = this.getUserID() || 0;
    this.state = {
      users: [],
      login: this.token.length > 0,
      actions: {},
      newUser: {id: '', email: "", name: "", password: '', phone: '', type: 0}
    };
    this.documentRef = {};
  }

  componentDidMount() {
    if (this.state.login) {
      this.loadUsers();
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
          this.loadUsers();
        }, 500);
      }
    });
  }

  getAdminHash() {
    return sessionStorage.getItem('admin_hash');
  }  

  getUserType(){
    return sessionStorage.getItem('user_type');
  }

  getUserID(){
    return sessionStorage.getItem('user_id');
  }

  loadUsers() {
    if (!this.state.login) {
      return;
    }
    const { uid } = Helper.getQueryStrings(window.location.search);
    this.token = this.token || this.getAdminHash() || '';
    this.userType = this.userType || this.getUserType || 2;
    this.userID = this.userID || this.getUserID() || 0;
    this.props.loadUsers({
      PATH_URL: `${API_URL.ADMIN_MANAGER.USER.LIST}`,
      headers: { AdminHash: this.token },
      successFn: (response) => {
        // console.log("response", response);
        if (response.status === 1) {
          this.setState({ users: response.data });
        }
      },
    });
  } 

  openEditUser (item) {
    this.setState({ newUser: {id: item.id, email: item.email, name: item.name, password: '', phone: item.phone, type: item.type} },()=>{

      console.log("item edit", item);
      
      this.props.change(nameFormAddNew, 'email', this.state.newUser.email);
      this.props.change(nameFormAddNew, 'name', this.state.newUser.name);
      this.props.change(nameFormAddNew, 'phone', this.state.newUser.phone);
      this.props.change(nameFormAddNew, 'type', {id: this.state.newUser.type});
      this.props.change(nameFormAddNew, 'password', this.state.newUser.password);      

      this.modalAddNewUserRef.open();
    })

  }

  confirmRemove(item) {         
    var r = confirm("Do you want remove this user?");
    if (r){
      this.removeUser(item);
    }
  }

  removeUser(item) {
    const data = new FormData();
    data.append('id', item.id);
    data.append('status', 0);
    
    this.props.addUpdateUser({
      PATH_URL: `${API_URL.ADMIN_MANAGER.USER.UPDATE}`,
      METHOD: 'POST',
      headers: { AdminHash: this.token },
      data,
      successFn: (response) => {
        if (response.status === 1) {
          this.loadUsers();          
          this.props.showAlert({
            message: <div className="text-center">Successfully Remove</div>,
            timeOut: 3000,
            type: 'success',
          });
        }         
      },
      errorFn: (e) => {
        alert(e.message);
        this.props.showAlert({
          message: <div className="text-center">Cannot Remove. Please try again</div>,
          timeOut: 3000,
          type: 'danger',
        });        
      },
    });
  }

  onTypeChange = (e, newValue) => {
    const newUser = this.state.newUser;

    if (newUser.type !== newValue.id) {
      newUser.type = newValue.id;
      this.setState({ newUser: newUser }, () => {        
      });
    }
  }

  onEmailChange=(e, email)=>{
    const newUser = this.state.newUser;

    if (newUser.email !== email) {
      newUser.email = email;
      this.setState({ newUser: newUser }, () => {        
      });
    }
  }
  onNameChange=(e, name)=>{
    const newUser = this.state.newUser;

    if (newUser.name !== name) {
      newUser.name = name;
      this.setState({ newUser: newUser }, () => {        
      });
    }
  }
  onPhoneChange=(e, phone)=>{
    const newUser = this.state.newUser;

    if (newUser.phone !== phone) {
      newUser.phone = phone;
      this.setState({ newUser: newUser }, () => {        
      });
    }
  }

  onPpasswordChange=(e, password)=>{
    const newUser = this.state.newUser;

    if (newUser.password !== password) {
      newUser.password = password;
      this.setState({ newUser: newUser }, () => {        
      });
    }
  }


  openCrateNewUserModal=()=>{
    this.setState({ newUser: {id: '', email: "", name: "", password: '', phone: '', type: 2} },()=>{
      this.props.change(nameFormAddNew, 'email', '');
      this.props.change(nameFormAddNew, 'name', '');
      this.props.change(nameFormAddNew, 'phone', '');      
      this.props.change(nameFormAddNew, 'password', '');    
      this.props.change(nameFormAddNew, 'type', {id: 2});  
      this.modalAddNewUserRef.open();
    })
    
  }

  onAddNew=()=>{
    let newUser = this.state.newUser;

    console.log("newUser", newUser);

    const data = new FormData();
    data.append('email', newUser.email);
    data.append('name', newUser.name);    
    
    data.append('phone', newUser.phone);
    data.append('type', newUser.type);

    let path = `${API_URL.USER.SIGNUP}`
    
    // if update
    if (newUser.id){
      data.append('id', newUser.id);
      path = `${API_URL.ADMIN_MANAGER.USER.UPDATE}`;
      if (newUser.password != ''){
        data.append('password', newUser.password);
      }
    }
    else{
      data.append('password', newUser.password);    
    }

    this.props.addUpdateUser({
      PATH_URL: path,
      METHOD: 'POST',      
      data,
      headers: { AdminHash: this.token },
      successFn: (response) => {
        if (response.status === 1) {
          this.modalAddNewUserRef.close();
          this.loadUsers();          
          this.props.showAlert({
            message: <div className="text-center">Successfully</div>,
            timeOut: 3000,
            type: 'success',
          });
        }         
      },
      errorFn: (e) => {
        alert(e.message);
        this.props.showAlert({
          message: <div className="text-center">{e.message}</div>,
          timeOut: 3000,
          type: 'danger',
        });        
      },
    });
  }
  

  render() {
    let popupTitle = this.state.newUser.id ? "Update User" : "Add new admin";    
    let passwordRequire = this.state.newUser.id ? [] : [required];
    const { users, login } = this.state;
    return !login ?
      (<Login />) : (
        <div className="admin-user-manager">

          <ModalDialog close={true} title={popupTitle} onRef={modal => this.modalAddNewUserRef = modal}>            
            <div className="body-add-new">              
            <AddNewUserForm className="form-add-new" onSubmit={this.onAddNew}>
            <Field
                key="1"
                name="name"
                placeholder={"FullName"}
                type="text"
                className="form-control"
                component={fieldInput}
                value={this.state.name}
                onChange={this.onNameChange}
                validate={[required]}                
              />

              <Field
                key="2"
                name="email"
                placeholder={"Email"}
                type="email"
                className="form-control"
                component={fieldInput}
                value={this.state.newUser.email}
                onChange={this.onEmailChange}
                validate={[required]}                
              />

              <Field
                key="3"
                name="phone"
                placeholder={"Phone"}
                type="text"
                className="form-control"
                component={fieldInput}
                value={this.state.newUser.phone}
                onChange={this.onPhoneChange}                
              />

              <Field
                key="4"
                name="password"
                placeholder={"Password"}
                type="password"
                className="form-control"
                component={fieldInput}
                value={this.state.newUser.password}
                onChange={this.onPpasswordChange}
                validate={passwordRequire}                
              />

              <div style={{"display": "none"}}>
              { this.userType == 1 &&
              <Field
                key="5"
                name="type"
                placeholder="Select User Type"
                defaultText="Select User Type"                
                className="form-control"
                component={fieldDropdown}
                value={this.state.newUser.type}
                list={[{id: 0, text: "User"}, {id: 1, text: "Root"}, {id: 2, text: "Admin"}]}
                onChange={this.onTypeChange}
                validate={[required]}                
              />
              }
              </div>

              <Button bsStyle="info" type="submit">Submit</Button>

            </AddNewUserForm>
            </div>
          </ModalDialog>

          <Table striped condensed hover>
            <thead>
              <tr>
                <th>ID</th>                
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>                
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, i) => {                
                const modifiedDate = moment(item.date_modified).format('MM/DD/YYYY');
                const type = item.type == 1 ? "Root" : (item.type == 2 ? "Admin" : "User");

                return (
                  <tr key={`manager_user_item_${item.id}`} ref={(node) => { this.documentRef[item.id] = node; }}>
                    <td>{item.id}</td>                    
                    <td>{item.username}</td>
                    <td>{item.name}</td>                                                            
                    <td>{item.email}</td>                                                            
                    <td>{type}</td>
                    <td>                    
                    {(this.userType == 1 || this.userID == item.id) &&
                    <span onClick={() => this.openEditUser(item)} className="edit-icon">&#9998;</span>                    
                    }
                    {this.userType == 1 &&
                      <span onClick={() => this.confirmRemove(item)} className="remove-icon">x</span>
                    }
                    {/* <Button bsSize="small" bsStyle="danger" onClick={() => this.confirmRemove(item)}>x</Button>  */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {this.userType == 1 &&
          <div className="add-new">
            <Button bsSize="small" bsStyle="info" onClick={() => this.openCrateNewUserModal()}>Add New</Button> 
          </div>
          }
        </div>
      );
  }
}

const mapState = state => ({
  login: state.admin.login,
});

const mapDispatch = ({
  loadUsers,
  addUpdateUser,
  showAlert,
  change, 
  clearFields
});

export default connect(mapState, mapDispatch)(Users);
