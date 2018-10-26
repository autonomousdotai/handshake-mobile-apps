import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { BETTING_RESULT } from '@/components/handshakes/betting/constants.js';
import {
  getBalance, getEstimateGas,
} from '@/components/handshakes/betting/utils';
import { MESSAGE } from '@/components/handshakes/betting/message.js';
import Checkbox from '@/components/core/controls/Checkbox';

import { BASE_API } from '@/constants';
import { Alert } from 'reactstrap';
import $http from '@/services/api';
import { showAlert } from '@/reducers/app/action';

import './BettingReport.scss';
import { auth } from 'firebase';

let token = null;
const TAG = 'BETTING_REPORT';
class BettingReport extends React.Component {
  static propTypes = {
    matches: PropTypes.array.isRequired,
    resolved: PropTypes.bool,
    isAdmin: PropTypes.bool,
    onReportSuccess: PropTypes.func,
  }
  static defaultProps = {
    resolved: false,
    isAdmin: true,
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
      reportChecked: false,

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
      //const newMatches = resolved ? matches.filter((item) => this.hasDisputeOutcome(item)) : matches;
      //const newOutcome = resolved ? this.filterDisputeOutcome(matches[0].outcomes) : matches[0].outcomes;
      const newMatches = matches;
      const newOutcome = matches[0].outcomes;

      this.setState({
        matches: newMatches,
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
  hasDisputeOutcome(match) {
    const outcomes = this.filterDisputeOutcome(match.outcomes);
    return outcomes.length > 0;
  }

  filterDisputeOutcome(outcomes) {
    const newOutcome = outcomes.filter((item) => this.isDisputeOutcome(item.result));
    return newOutcome;
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
      //const newOutcome = resolved ? updatedMatch[0].outcomes.filter((item) => this.isDisputeOutcome(item.result)) : updatedMatch[0].outcomes;
      const newOutcome = updatedMatch[0].outcomes;

      //console.log(TAG, 'newOutcome:', newOutcome);
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
    localStorage.setItem('disable', true);
    setTimeout(() => {
      localStorage.setItem('disable', false);
      //this.fetchMatches();
      this.setState({
        disable: false,
      });
    }, 1000);
  }

  async validate(outcomes) {
    const { isAdmin } = this.props;
    let message = " ";
    let status = true;

    if (!isAdmin) {
      const balance = await getBalance();
      const estimatedGas = await getEstimateGas();
      const totalGas = estimatedGas * outcomes.length;

      if (totalGas > balance) {
        message = MESSAGE.NOT_ENOUGH_GAS.replace('{{value}}', totalGas);
        status = false;
      }
    }

    return { status, message };

  }
  checkToken() {
    if (localStorage.getItem('Token') !== null) {
      return localStorage.getItem('Token');
    }
    return null;
  }
  checkReportStatus = (reportChecked) => {
    this.setState({
      reportChecked: !reportChecked,
    });
  }
  onSubmit= async (event) => {
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
      const { isAdmin } = this.props;
      const isValid = await this.validate(this.state.final);
      console.log(TAG, 'isValide:', isValid);
      const { status, message } = isValid;
      if (status) {

        const tokenValue = token || this.checkToken();
        const authenticate = { Authorization: `Bearer ${tokenValue}`, 'Content-Type': 'application/json' };
        const headers = isAdmin ? authenticate : null;
        console.log('Final State:', this.state.final);

        const url = isAdmin ? `${BASE_API.BASE_URL}/cryptosign/admin/match/report/${this.state.activeMatchData.id}` :
                    `${BASE_API.BASE_URL}/cryptosign/match/report/${this.state.activeMatchData.id}`;

        const submit = $http({
          url,
          data: {
            result: this.state.final,
          },
          //qs: { dispute: resolved ? 1 : 0 },
          headers: headers,
          method: 'post',
        });


        submit.then((response) => {
          response.data.status === 1 && this.setState({
            disable: true,
          });

          response.data.status === 1 && this.onReportSuccess(response);

          response.data.status === 0 && this.onReportFailed(response);
        });

      } else {
        this.props.showAlert({
          message: <div className="text-center">{message}</div>,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          },
        });
      }
    }
  }
  onReportSuccess = (response) => {
    this.disablePage();
    this.props.onReportSuccess(this.state.final);


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
  renderCheckNotHappend = () => {
    return (
      <div className="wrapperCheckNotHappend">
        <Checkbox
          className="checkboxInput"
          name="checkreport"
          checked={this.state.reportChecked}
          onChange={() => {
            this.checkReportStatus(this.state.reportChecked);
          }}
        />
        <div className="checkReportTitle"
          onClick={() => {
            this.checkReportStatus(this.state.reportChecked);
          }}
        >This event not happen
        </div>
      </div>
    );
  }
  renderEvents() {
    return (
      <FormGroup disabled={this.state.disable}>
        <Label for="matchSelect">Select Event</Label>
        <Input type="select" name="select" id="matchSelect" onChange={(event) => { this.onChangeEvent(event, 'selectedMatch'); }} disabled={this.state.disable}>
          {this.state.matches && this.state.matches.length > 0 && this.state.matches.map(item => <option key={item.id}>{item.name} id:{item.id}</option>)}
        </Input>
      </FormGroup>
    );
  }
  renderOucomes() {
    return (
      <div className="wrapperOutcomes">
        <Label for="outcomeSelect">Outcomes</Label><br />
        {this.state.outcomes && this.state.outcomes.length > 0 && this.state.outcomes.map(item => (<Label check key={item.id} style={{}}>{item.name}<br />
          {/* side: 1 (support), 2 (against), 3 (draw) */}
          <div className="result">
            <FormGroup check>
              <Label check>
                <Input type="radio" name={`selectedOption-${item.id}`} onChange={() => { this.onChangeFinal(item, BETTING_RESULT.SUPPORT_WIN); }} value="1" />{' '}
              Support
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name={`selectedOption-${item.id}`} onChange={() => { this.onChangeFinal(item, BETTING_RESULT.AGAINST_WIN); }} value="2" />{' '}
              Oppose
              </Label>
            </FormGroup>
          </div>
          <br /><br />
        </Label>))}
      </div>
    );
  }

  render() {
    return (
      <div className="form-admin">
        <Form style={{ margin: '1em', WebkitAppearance: 'menulist' }}>
          {this.renderEvents()}
          {this.renderCheckNotHappend()}
          {this.renderOucomes()}
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
