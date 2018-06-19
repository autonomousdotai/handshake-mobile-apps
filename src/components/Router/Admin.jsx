import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Loading from '@/components/core/presentation/Loading';
import { URL } from '@/constants';
import { Button, Form, FormGroup, Label, Input, FormText, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { loadMatches } from '@/reducers/betting/action';
import { BASE_API, API_URL, APP } from '@/constants';
import axios from 'axios';
import md5 from 'md5';
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
    };
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
    const password = md5('admin@ninja.orgAutonomous');
    const auth = $http(`${BASE_API.BASE_URL}/cryptosign/auth`, {
      email: 'admin@ninja.org',
      password,
    }, '', '', '', 'post');
    auth.then((response) => {
      token = response.data.data.access_token;
    });
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

  onSubmit=(event) => {
    const url = `${BASE_API.BASE_URL}/cryptosign/match/report/${this.state.activeMatchData.id}`;
    const submit = $http(url, {
      homeScore: this.state.activeMatchData.homeScore,
      awayScore: this.state.activeMatchData.awayScore,
      result: { outcome_id: this.state.selectedOutcome, side: this.state.selectedResult },
    }, '', '', { Authorization: `Bearer ${token}` }, 'post');
    submit.then((response) => {
      console.log(response);
    });
  }
  render() {
    return (
      <Form style={{ margin: '1em', WebkitAppearance: 'menulist' }}>
        <FormGroup>
          <Label for="matchSelect">Select Match</Label>
          <Input type="select" name="select" id="matchSelect" onChange={(event) => { this.onChangeEvent(event, 'selectedMatch'); }}>
            {this.state.matches && this.state.matches.length > 0 && this.state.matches.map(item => <option key={item.id}>{item.name}</option>)}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="outcomeSelect">Select Outcome</Label>
          <Input type="select" name="select" id="outcomeSelect" onChange={(event) => { this.onChangeOutcome(event, 'selectedOutcome'); }}>
            {this.state.outcomes && this.state.outcomes.length > 0 && this.state.outcomes.map(item => <option key={item.id}>{`${item.name},id:${item.id}`}</option>)}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="resultOfMatch">Result of Match</Label>
          <Input type="select" name="select" id="resultOfMatch" onChange={(event) => { this.onChangeResult(event, 'selectedResult'); }}>
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
            onChange={(event) => { this.onChangeScore(event, 'awayScore'); }}
          />
        </FormGroup>
        <Button onClick={this.toggle}>Submit</Button>
        <div>
          <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-sm">
            <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
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
