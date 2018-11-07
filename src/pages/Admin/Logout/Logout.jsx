
import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { API_URL } from '@/constants';
import { connect } from 'react-redux';
import { userAuthenticate } from '@/reducers/admin/action';
import md5 from 'md5';


class Logout extends React.Component {

  componentDidMount() {
    let self = this;
    sessionStorage.removeItem('admin_hash');
    setTimeout(function(){ self.reload(); }, 300);
  }

  reload = () => {    
    window?.location?.reload && window?.location?.reload();
  }

  render() {

    return (
      <h2 style={{textAlign: "center", marginTop: "20px"}}>
        Sign Out ...
      </h2>
    );

  }
}

const mapState = state => ({

});
const mapDispatch = ({
  
});
export default connect(mapState, mapDispatch)(Logout);
