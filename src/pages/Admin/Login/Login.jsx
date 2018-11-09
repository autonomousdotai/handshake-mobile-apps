
import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { API_URL } from '@/constants';
import { connect } from 'react-redux';
import { userAuthenticate } from '@/reducers/admin/action';
import md5 from 'md5';


class Login extends React.Component {

  loginUser=(event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    const email = data.get('email');
    const password = data.get('password');

    /*
    const auth = $http({
      url: `${BASE_API.BASE_URL}/cryptosign/auth`,
      data: {
        email,
        password,
      },
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
    });
    auth.then((response) => {
      if (response.data.status === 1) {
        const token = response.data.data.access_token;
        localStorage.setItem('Token', token);
        localStorage.setItem('TokenInit', new Date());
        this.setState({
          login: true,
        });
      }
    });
    */
    this.authenticateUser(email, password);
  }
  authenticateUser(email, password) {    

    const userData = new FormData();
    userData.set('email', email);
    userData.set('password', password);

    this.props.userAuthenticate({
      PATH_URL: `${API_URL.USER.LOGIN}`,
      METHOD: 'POST',
      data: userData,
      headers: { 'Content-Type': 'multipart/form-data' },
      successFn: ((response) => {
        const token = response.data.password;
        const userType = response.data.type;
        if (userType == 0){
          alert("Not admin!!!");
          return;
        }
        localStorage.setItem('Token', token);        
        localStorage.setItem('TokenInit', new Date());
        sessionStorage.setItem('admin_hash', token);
        sessionStorage.setItem('user_type', response.data.type);
        sessionStorage.setItem('user_id', response.data.id);

        // callback called if login successfully
        if (typeof this.props?.onLoggedIn === 'function') {
          this.props.onLoggedIn();
        }
      }),
      errorFn: (e)=>{
        alert(e.message);
      }
    });
  }

  render() {

    return (
      <Form style={{ margin: '1em', WebkitAppearance: 'menulist' }} onSubmit={this.loginUser}>
        <FormGroup>
          <Label for="login">Login</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
            required
          />
          <br />
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password"
          />
          <br />
          <Button type="submit">Submit</Button>
          <br />
        </FormGroup>
      </Form>
    );

  }
}

const mapState = state => ({

});
const mapDispatch = ({
  userAuthenticate,
});
export default connect(mapState, mapDispatch)(Login);
