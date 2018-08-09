import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { BETTING_RESULT } from '@/components/handshakes/betting/constants.js';
import { BASE_API } from '@/constants';
import { Alert } from 'reactstrap';
import $http from '@/services/api';
import { showAlert } from '@/reducers/app/action';

import './BettingReport.scss';

let token = null;
const TAG = 'BETTING_REPORT';
class BettingReport extends React.Component {
  static propTypes = {
    matches: PropTypes.array.isRequired,
    resolved: PropTypes.bool,
    onReportSuccess: PropTypes.func,
  }
  static defaultProps = {
    resolved: false,
  };
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
      disable: false,
      final: [],
      errorMessage: '',
    };
    this.toggle = this.toggle.bind(this);
    // side: 0 (unknown), 1 (support), 2 (against)
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    const { matches } = nextProps;

    this.setInitials(matches);

  }

  setInitials(matches) {
    const { resolved } = this.props;
    if (matches.length > 0) {
      const newOutcome = resolved ? matches[0].outcomes.filter((item) => this.isDisputeOutcome(item.result)) : matches[0].outcomes;

      this.setState({
        matches,
        outcomes: newOutcome,
        activeMatchData: matches[0],
        selectedMatch: matches[0].name,
      });
    } else {
      this.setState({
        matches,
        outcomes: [],
        activeMatchData: {},
        selectedMatch: 1,
      });
    }
  }


  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }
  isDisputeOutcome(result) {
    return result === BETTING_RESULT.DISPUTED;
  }

  fillOutcome() {

    const { resolved } = this.props;
    const updatedMatch = this.state.matches.filter((item) => {
      if (item.id === this.state.selectedMatch) {
        return item;
      }
    });
    if (updatedMatch[0].outcomes && updatedMatch[0].outcomes.length > 0) {
      const final = [];
      updatedMatch[0].outcomes.map((item) => {
        const obj = {
          outcome_id: item.id,
          side: 0,
        };
        final.push(obj);
        return final;
      });
      const newOutcome = resolved ? updatedMatch[0].outcomes.filter((item) => this.isDisputeOutcome(item.result)) : updatedMatch[0].outcomes;
      console.log(TAG, 'newOutcome:', newOutcome);
      this.setState({
        outcomes: newOutcome,
        activeMatchData: updatedMatch[0],
        selectedOutcome: updatedMatch[0].outcomes[0].id,
        final,
      });
    } else {
      this.setState({
        outcomes: [],
      });
    }
  }

  onChangeEvent=(event, type) => {
    this.setState({ [type]: Number(event.target.value.split(':')[1]) }, this.fillOutcome);
    this.setState({ errorMessage: '' });
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


  disablePage() {
    console.log('Disable Page');
    localStorage.setItem('disable', true);
    setTimeout(() => {
      localStorage.setItem('disable', false);
      //this.fetchMatches();
      this.props.onReportSuccess();
      this.setState({
        disable: false,
      });
    }, 1000);
  }

  checkToken() {
    if (localStorage.getItem('Token') !== null) {
      return localStorage.getItem('Token');
    }
    return null;
  }
  onSubmit= (event) => {
    const radios = [];
    if (localStorage.getItem('disable') === false) {
      return null;
    }
    if (this.state.outcomes && this.state.outcomes.length === 0) {
      return null;
    }
    if (document.getElementsByTagName('form')) {
      const inputs = document.getElementsByTagName('form')[0].elements;
      // Loop and find only the Radios
      for (let i = 0; i < inputs.length; ++i) {
        if (inputs[i].type == 'radio') {
          radios.push(inputs[i]);
        }
      }
    }
    const valid = radios.length > 0 && radios.map((item) => {
      if (item.checked) {
        return true;
      }
      return false;
    });
    const trueValues = valid.filter(item => item == true);
    if (trueValues.length < radios.length / 3) {
      this.props.showAlert({
        message: <div className="text-center">Please select atleast 1 option in each row.</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {},
      });
    } else {
      const tokenValue = token || this.checkToken();
      const { resolved } = this.props;
      console.log('Final State:', this.state.final);

      const url = `${BASE_API.BASE_URL}/cryptosign/match/report/${this.state.activeMatchData.id}`;
      const submit = $http({
        url,
        data: {
          result: this.state.final,
        },
        qs: { dispute: resolved ? 1 : 0 },
        headers: { Authorization: `Bearer ${tokenValue}`, 'Content-Type': 'application/json' },
        method: 'post',
      });

      submit.then((response) => {
        response.data.status === 1 && this.setState({
          disable: true,
        });

        response.data.status === 1 && this.onReportSuccess(response);

        response.data.status === 0 && this.onReportFailed(response);
      });

    }
  }
  onReportSuccess = (response) => {
    this.disablePage();

    this.props.showAlert({
      message: <div className="text-center">Success!</div>,
      timeOut: 3000,
      type: 'success',
      callBack: () => {},
    });

  }
  onReportFailed = (response) => {
    this.disablePage();

    this.props.showAlert({
      message: <div className="text-center">{response.data.message}</div>,
      timeOut: 3000,
      type: 'danger',
      callBack: () => {},
    });

  }
  onChangeFinal=(item, result) => {
    console.log(item, result);
    const finalCopy = [...this.state.outcomes];
    finalCopy.map((outcomeItem) => {
      if (outcomeItem.id === item.id) {
        outcomeItem.side = result;
        outcomeItem.outcome_id = item.id;
      }
      return outcomeItem;
    });
    this.setState({
      final: finalCopy,
    });
  }

  render() {
    return (
      <div className="form-admin">
        <Form style={{ margin: '1em', WebkitAppearance: 'menulist' }}>
          <FormGroup disabled={this.state.disable}>
            <Label for="matchSelect">Select Match</Label>
            <Input type="select" name="select" id="matchSelect" onChange={(event) => { this.onChangeEvent(event, 'selectedMatch'); }} disabled={this.state.disable}>
              {this.state.matches && this.state.matches.length > 0 && this.state.matches.map(item => <option key={item.id}>{item.name} id:{item.id}</option>)}
            </Input>
          </FormGroup>
          <Label for="outcomeSelect">Outcomes</Label><br />
          {/* <FormGroup id="outcomeSelect" onChange={(event) => { this.onChangeOutcome(event, 'selectedOutcome'); }} disabled={this.state.disable}> */}
          {this.state.outcomes && this.state.outcomes.length > 0 && this.state.outcomes.map(item => (<Label check key={item.id} style={{}}>{`${item.name},id:${item.id}`}<br />
            {/* side: 1 (support), 2 (against), 3 (draw) */}

            <FormGroup check>
              <Label check>
                <Input type="radio" name={`selectedOption-${item.id}`} onChange={() => { this.onChangeFinal(item, BETTING_RESULT.DRAW); }} required value="0" />{' '}
              Draw
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name={`selectedOption-${item.id}`} onChange={() => { this.onChangeFinal(item, BETTING_RESULT.SUPPORT_WIN); }} value="1" />{' '}
              Support
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name={`selectedOption-${item.id}`} onChange={() => { this.onChangeFinal(item, BETTING_RESULT.AGAINST_WIN); }} value="2" />{' '}
              Against
              </Label>
            </FormGroup><br /><br />
          </Label>))}
          <br /> <br />

          <Button disabled={this.state.disable} onClick={this.onSubmit}>Submit</Button>

        </Form>
        {
          this.state.disable &&
          <div><br />
            <Alert color="success">
            Match details submitted. Please wait.
            </Alert>
          </div>
      }
      </div>
    );
  }
}

const mapDispatch = ({
  showAlert,
});
export default connect(null, mapDispatch)(BettingReport);
