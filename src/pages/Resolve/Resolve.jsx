import React from 'react';
import { connect } from 'react-redux';
import { loadMatches } from '@/reducers/betting/action';
import { API_URL } from '@/constants';
import Login from '@/components/handshakes/betting-event/Login';

import BettingReport from '@/components/handshakes/betting-event/BettingReport';

import './Resolve.scss';

const TAG = 'RESOLVE';

class Resolve extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      login: false,
    };
  }

  componentDidMount() {
    const token = this.checkToken() || '';
    console.log(TAG, 'TOKEN:', token);
    if (token.length > 0) {
      this.setState({
        login: true,
      });
      this.fetchMatches();
    }

  }

  componentWillReceiveProps(nextProps) {
    const { matches, login } = nextProps;
    const newLogin = login === true ? login : this.state.login;
    if (login && login !== this.state.login) {
      this.fetchMatches();
    }
    this.setState({
      login: newLogin,
      matches,
    });
  }

  checkToken() {
    if (localStorage.getItem('Token') !== null) {
      return localStorage.getItem('Token');
    }
    return localStorage.getItem('Token');
  }


  fetchMatches() {
    console.log('fetchMatches');
    const tokenValue = this.checkToken();

    this.props.loadMatches({
      PATH_URL: `${API_URL.CRYPTOSIGN.ADMIN_RESOLVE}`,
      headers: { Authorization: `Bearer ${tokenValue}`, 'Content-Type': 'application/json' },
    });
  }
  render() {
    const { matches, login } = this.state;
    return (!login ?
      <Login /> :
      <BettingReport
        matches={matches}
        resolved
        onReportSuccess={()=> {
          this.fetchMatches();
        }}
      />
    );
  }
}


const mapState = state => ({
  matches: state.betting.matches,
  login: state.admin.login,
});
const mapDispatch = ({
  loadMatches,
});


export default connect(mapState, mapDispatch)(Resolve);
