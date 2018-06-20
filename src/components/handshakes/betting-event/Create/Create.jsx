import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Field, formValueSelector, clearFields } from 'redux-form';
import Button from '@/components/core/controls/Button';
import { PredictionHandshake } from '@/services/neuron';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { fieldDropdown, fieldInput, fieldRadioButton } from '@/components/core/form/customField';
import createForm from '@/components/core/form/createForm';
import { showLoading, hideLoading } from '@/reducers/app/action';
import { required } from '@/components/core/form/validation';
import { Label, Col, Row } from 'reactstrap';
import DatePicker from './DatePicker';
import './Create.scss';
import { MasterWallet } from '@/models/MasterWallet';
import { __asyncValues } from 'tslib';
import { loadMatches } from '@/reducers/betting/action';
import Dropdown from '@/components/core/controls/Dropdown';
import { HANDSHAKE_ID, API_URL, APP } from '@/constants';

const wallet = MasterWallet.getWalletDefault('ETH');
const chainId = wallet.chainId;
const predictionhandshake = new PredictionHandshake(chainId);

const nameFormSaveBettingEvent = 'saveBettingEvent';
const SaveBettingEventForm = createForm({ propsReduxForm: { form: nameFormSaveBettingEvent, enableReinitialize: true, clearSubmitErrors: true } });
class CreateBettingEvent extends React.Component {
  static propTypes = {
    // children: PropTypes.any.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      selectedMatch: '',
      values: {},
      name: '',
      outcome: '',
      closingTime: '',
      resolutionSource: '',
      reportingTime: '',
      disputeTime: '',
      creatorFee: null,
      referralFee: null,
      newEvent: false,
    };
  }

  componentDidMount() {
    // console.log('Betting Create Props:', this.props, history);
    // this.setState({
    //   address: wallet.address,
    //   privateKey: wallet.privateKey,
    // })
    this.props.loadMatches({ PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      matches: nextProps.matches,
    });
  }

  showLoading = () => {
    this.props.showLoading({ message: '' });
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  updateFormField = (event, stateName) => {
    this.setState({
      [stateName]: event.target.value,
    });
  }

  submitOutCome = (values) => {
    const url = API_URL.CRYPTOSIGN.ADD_OUTCOME.concat(`/${this.state.selectedMatch.id}`);
    this.props.loadMatches({
      PATH_URL: url,
      METHOD: 'post',
      data: [{ name: values.outcome }],
      successFn: (response) => {
        console.log(response.data);
        const result = predictionhandshake.createMarket(this.state.creatorFee, this.state.resolutionSource, this.state.closingTime, this.state.reportingTime, this.state.disputeTime, response.data.id);
        console.log(result);
      },
      errorFn: () => { },
    });
  }
  submitNewEvent = (values) => {
    const data = [
      {
        homeTeamName: '',
        awayTeamName: '',
        date: this.state.closingTime,
        homeTeamCode: '',
        homeTeamFlag: '',
        awayTeamCode: '',
        awayTeamFlag: '',
        name: this.state.eventName,
        source: this.state.resolutionSource,
        market_fee: this.state.creatorFee,
        outcomes: [
          {
            name: this.state.outcome,
          },
        ],
      },
    ];
    this.props.loadMatches({
      PATH_URL: API_URL.CRYPTOSIGN.ADD_MATCH,
      METHOD: 'post',
      data,
      successFn: (response) => {
        console.log(response.data);
        const result = predictionhandshake.createMarket(this.state.creatorFee, this.state.resolutionSource, this.state.closingTime, this.state.reportingTime, this.state.disputeTime, response.data.id);
        console.log(result);
      },
      errorFn: () => { },
    });
  }
  submitBettingEvent= (values) => {
    console.log(values);
    this.state.newEvent ? this.submitNewEvent(values) : this.submitOutCome(values);
  }
  getStringDate(date) {
    const formattedDate = moment.unix(date).format('MMM DD');
    return formattedDate;
  }
  get matchNames() {
    const { matches } = this.state;
    // return matches.map((item) => ({ id: item.id, value: `${item.homeTeamName} - ${item.awayTeamName} (${this.getStringDate(item.date)})` }));
    const mathNamesList = matches.map(item => ({ id: item.id, value: `Event: ${item.name} (${this.getStringDate(item.date)})`, marketFee: item.market_fee }));
    return [
      ...mathNamesList,
    ];
  }

  changeDate(date, stateName) {
    this.setState({
      [stateName]: date,
    });
  }

  handleNewEvent=() => {
    this.setState({
      newEvent: true,
    });
  }
  render() {
    const defaultMatchId = this.defaultMatch ? this.defaultMatch.id : null;
    const defaultOutcomeId = this.defaultOutcome ? this.defaultOutcome.id : null;
    return (
      <div>
        <SaveBettingEventForm className="save-betting-event" onSubmit={this.submitBettingEvent}>
          <Row className="events-label-button-block">
            <Col xs="6" className="events-label-button-block-col">
              <Label for="eventName" className="font-weight-bold text-uppercase event-label">Event</Label>
            </Col>
            <Col xs="6" className="events-label-button-block-col">
              <Button type="button" block className="btnPrimary create-event-button" onClick={this.handleNewEvent}>Create New Event</Button>
            </Col>
          </Row>
          {this.state.matches && this.state.matches.length > 0 && <Dropdown
            placeholder="Select an event"
            defaultId={defaultMatchId}
            className="dropDown"
            afterSetDefault={(item) => {
              const { values } = this.state;
              values.event_name = item.value;
              this.setState({ selectedMatch: item, values });
            }}
            source={this.matchNames}
            onItemSelected={(item) => {
                const { values } = this.state;
                values.event_name = item.value;
                this.setState({ selectedMatch: item, values, newEvent: false });
              }
              }
          />}
          {this.state.newEvent && <Field
            name="eventName"
            type="text"
            className="form-control input-event-name input-field"
            placeholder="Event name"
            component={fieldInput}
            value={this.state.eventName}
            onChange={evt => this.updateFormField(evt, 'eventName')}
          />}
          <Field
            name="outcome"
            type="text"
            className="form-control input-field"
            placeholder="Outcome"
            component={fieldInput}
            value={this.state.outcome}
            onChange={evt => this.updateFormField(evt, 'outcome')}
            validate={[required]}
          />
          {this.state.newEvent && (
          <div><Label for="reporting" className="font-weight-bold text-uppercase reporting-label">Reportings</Label>
            <Field
              name="reportingSource"
              type="text"
              className="form-control input-field"
              placeholder="Resolution source"
              component={fieldInput}
              value={this.state.resolutionSource}
              onChange={evt => this.updateFormField(evt, 'resolutionSource')}
            />
            <DatePicker onChange={(date) => { this.changeDate(date, 'closingTime'); }} className="form-control input-field" placeholder="Closing Time" required />
            <DatePicker onChange={(date) => { this.changeDate(date, 'reportingTime'); }} className="form-control input-field" placeholder="Reporting Time" required />
            <DatePicker onChange={(date) => { this.changeDate(date, 'disputeTime'); }} className="form-control input-field" placeholder="Dispute Time" required />
          </div>
        )}
          <Label for="creatorFee" className="font-weight-bold text-uppercase fees-label">Fees</Label>
          <Field
            name="creatorFee"
            type="number"
            className="form-control input-field"
            placeholder="Creator Fee"
            component={fieldInput}
            value={this.state.creatorFee}
            onChange={evt => this.updateFormField(evt, 'creatorFee')}

          />
          <Label for="feesDesc" className="">The creator fee is a percentage of the total winnings of the market.</Label>
          {/* <Label for="referralFee" className="font-weight-bold text-uppercase fees-label">Referral</Label>
          <Field
            name="referralFee"
            type="number"
            className="form-control input-field"
            placeholder="Referral Fee"
            component={fieldInput}
            value={this.state.referralFee}
            onChange={evt => this.updateFormField(evt, 'referralFee')}

          />
          <Label for="reffeesDesc" className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. </Label> */}
          <Button type="submit" block className="btnGreen submit-button">Submit</Button>
        </SaveBettingEventForm>
      </div>
    );
  }
}

// const mapState = (state) => {
//   const { auth } = state;
//   return { auth };
// };

// export default connect(mapState)(NewComponent);
const mapStateToProps = state => ({
  matches: state.betting.matches,
});

const mapDispatchToProps = dispatch => ({
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  loadMatches: bindActionCreators(loadMatches, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CreateBettingEvent));
