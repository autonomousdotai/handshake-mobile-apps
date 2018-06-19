import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { loadMatches } from '@/reducers/betting/action';
import { BASE_API, API_URL } from '@/constants';
import md5 from 'md5';
import { Alert } from 'reactstrap';
import $http from '@/services/api';

let token = null;
class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selectedMatch: 1,
      selectedOutcome: 1,
      selectedResult: 0,
      matches: [],
      outcomes: [],
      activeMatchData: {},
      login: false,
      disable: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    if (this.checkToken() != null) {
      this.setState({
        login: true,
      });
    }
    this.fetchMatches();
  }

  componentWillReceiveProps(nextProps) {
    const { matches } = nextProps;
    matches.length > 0 && this.setState({
      matches,
      outcomes: matches[0].outcomes,
      activeMatchData: matches[0],
      selectedMatch: matches[0].name,
      selectedOutcome: matches[0].outcomes[0].id,
    });
  }

  fetchMatches() {
    this.props.loadMatches({
      PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES,
      successFn: (res) => {
        const { data } = res;
        console.log('loadMatches success', data);
      },
      errorFn: (e) => {
        console.log('loadMatches failed', e);
      },
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  fillOutcome() {
    const updatedMatch = this.state.matches.filter((item) => {
      if (item.name === this.state.selectedMatch) {
        console.log(`SEE THIS${JSON.stringify(item.outcomes)}`);
        return item;
      }
    });
    updatedMatch[0].outcomes && updatedMatch[0].outcomes.length > 0 && this.setState({
      outcomes: updatedMatch[0].outcomes,
      activeMatchData: updatedMatch[0],
      selectedOutcome: updatedMatch[0].outcomes[0].id,
    });
  }

  onChangeEvent=(event, type) => {
    this.setState({ [type]: event.target.value }, this.fillOutcome);
  }
  onChangeOutcome=(event, type) => {
    this.setState({
      selectedOutcome: Number(event.target.value.split(',id:')[1]),
    });
  }
  onChangeResult=(event, type) => {
    this.setState({
      [type]: Number(event.target.value),
    });
  }

  onChangeScore=(event, type) => {
    const activeMatchData = this.state.activeMatchData;
    activeMatchData[type] = event.target.value;
    this.setState({
      activeMatchData,
    });
  }

  loginUser=(event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    const email = data.get('email');
    const password = md5(`${data.get('password')}Autonomous`);

    const auth = $http({
      url: `${BASE_API.BASE_URL}/cryptosign/auth`,
      data: {
        email,
        password,
      },
      method: 'post',
    });
    auth.then((response) => {
      if (response.data.status === 1) {
        token = response.data.data.access_token;
        localStorage.setItem('Token', token);
        localStorage.setItem('TokenInit', new Date());
        this.setState({
          login: true,
        });
      }
    });
  }

  disablePage() {
    localStorage.setItem('disable', true);
    setTimeout(() => {
      localStorage.setItem('disable', false);
      this.fetchMatches();
      this.setState({
        disable: false,
      });
    }, 120000);
  }

  checkToken() {
    if (localStorage.getItem('Token') !== null) {
      return localStorage.getItem('Token');
    }
    return null;
  }
  onSubmit= (event) => {
    if (localStorage.getItem('disable') === false) {
      return null;
    }
    const tokenValue = token || this.checkToken();
    const url = `${BASE_API.BASE_URL}/cryptosign/match/report/${this.state.activeMatchData.id}`;
    const submit = $http({
      url,
      data: {
        homeScore: Number(this.state.activeMatchData.homeScore),
        awayScore: Number(this.state.activeMatchData.awayScore),
        result: { outcome_id: this.state.selectedOutcome, side: this.state.selectedResult },
      },
      headers: { Authorization: `Bearer ${tokenValue}` },
      method: 'post',
    });
    submit.then((response) => {
      response.data.status === 1 && this.setState({
        modal: false,
        disable: true,
      }, this.disablePage);
      console.log(response);
    });
  }
  render() {
    return (!this.state.login ?
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
      :
      <div>
        <Form style={{ margin: '1em', WebkitAppearance: 'menulist' }}>
          <FormGroup disabled={this.state.disable}>
            <Label for="matchSelect">Select Match</Label>
            <Input type="select" name="select" id="matchSelect" onChange={(event) => { this.onChangeEvent(event, 'selectedMatch'); }} disabled={this.state.disable}>
              {this.state.matches && this.state.matches.length > 0 && this.state.matches.map(item => <option key={item.id}>{item.name}</option>)}
            </Input>
          </FormGroup>
          <FormGroup disabled={this.state.disable}>
            <Label for="outcomeSelect">Select Outcome</Label>
            <Input type="select" name="select" id="outcomeSelect" onChange={(event) => { this.onChangeOutcome(event, 'selectedOutcome'); }} disabled={this.state.disable}>
              {this.state.outcomes && this.state.outcomes.length > 0 && this.state.outcomes.map(item => <option key={item.id}>{`${item.name},id:${item.id}`}</option>)}
            </Input>
          </FormGroup>
          <FormGroup disabled={this.state.disable}>
            <Label for="resultOfMatch">Result of Match</Label>
            <Input type="select" name="select" id="resultOfMatch" onChange={(event) => { this.onChangeResult(event, 'selectedResult'); }} disabled={this.state.disable}>
              <option>0</option>
              <option>1</option>
              <option>2</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="homescore">Home Score</Label>
            <Input
              type="number"
              name="homeScore"
              id="homescore"
              placeholder="Home Score"
              value={this.state.activeMatchData.homeScore || ''}
              onChange={(event) => { this.onChangeScore(event, 'homeScore'); }}
              disabled={this.state.disable}
            />
          </FormGroup>
          <FormGroup>
            <Label for="awayscore">Away Score</Label>
            <Input
              type="number"
              name="awayScore"
              id="awayscore"
              placeholder="Away Score"
              value={this.state.activeMatchData.awayScore || ''}
              disabled={this.state.disable}
              onChange={(event) => { this.onChangeScore(event, 'awayScore'); }}
            />
          </FormGroup>
          <Button disabled={this.state.disable} onClick={this.toggle}>Submit</Button>

          {this.state.disable && <div><br /><Alert color="success">
            Match details submitted. Please wait.
                                            </Alert>
                                 </div>}
          <div>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-sm">
              <ModalHeader toggle={this.toggle}>Update Match Data</ModalHeader>
              <ModalBody>
                <Label>Selected Match - {this.state.selectedMatch}</Label> <br />
                <Label>Selected Outcome {this.state.selectedOutcome}</Label> <br />
                <Label>Selected Result {this.state.selectedResult}</Label> <br />
                <Label>HomeScore {this.state.activeMatchData.homeScore}</Label> <br />
                <Label>AwayScore {this.state.activeMatchData.awayScore}</Label> <br />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.onSubmit}>Confirm</Button>{' '}
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </div>
        </Form>
      </div>
    );
  }
}

const mapState = state => ({
  matches: state.betting.matches,
});

const mapDispatch = ({
  loadMatches,
});

export default connect(mapState, mapDispatch)(Admin);
