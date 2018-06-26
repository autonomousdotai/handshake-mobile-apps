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
import { loadMatches, addMatch } from '@/reducers/betting/action';
import Dropdown from '@/components/core/controls/Dropdown';
import { Alert } from 'reactstrap';
import { API_URL, APP, URL } from '@/constants';
import history from '@/services/history';
import { showAlert } from '@/reducers/app/action';

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
      eventType: '',
      newEventType: '',
      key: 1,
    };
  }

  componentDidMount() {
    // console.log('Betting Create Props:', this.props, history);
    // this.setState({
    //   address: wallet.address,
    //   privateKey: wallet.privateKey,
    // })
    this.props.loadMatches({ PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES, headers: { 'Content-Type': 'application/json' } });
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
    const activeMatchDetailsArray = this.state.matches.filter((item) => {
      if (this.state.selectedMatch.id === item.id) {
        return item;
      }
      return null;
    });
    const activeMatchDetails = activeMatchDetailsArray[0];
    this.props.addMatch({
      PATH_URL: url,
      METHOD: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: [{ name: values.outcome }],
      successFn: (response) => {
        console.log(response.data);
        this.props.showAlert({
          message: <div className="text-center">Outcome added successfully.</div>,
          timeOut: 3000,
          type: 'success',
          callBack: () => { },
        });
        const result = predictionhandshake.createMarket(activeMatchDetails.market_fee, activeMatchDetails.source, activeMatchDetails.date, activeMatchDetails.reportTime, activeMatchDetails.disputeTime, response.data[0].id);
        console.log(result);
        this.props.history.push(URL.HANDSHAKE_DISCOVER);
      },
      errorFn: (response) => {
        response.message && this.props.showAlert({
          message: <div className="text-center">{response.message}</div>,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {},
        });
      },
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
        reportTime: this.state.reportingTime,
        disputeTime: this.state.disputeTime,
        name: this.state.eventName,
        source: this.state.resolutionSource,
        public: 0,
        market_fee: this.state.creatorFee,
        outcomes: [
          {
            name: this.state.outcome,
          },
        ],
      },
    ];
    this.props.addMatch({
      PATH_URL: API_URL.CRYPTOSIGN.ADD_MATCH,
      METHOD: 'post',
      data,
      headers: { 'Content-Type': 'application/json' },
      successFn: (response) => {
        console.log(response.data);
        this.props.showAlert({
          message: <div className="text-center">Event added successfully.</div>,
          timeOut: 3000,
          type: 'success',
          callBack: () => { },
        });
        this.props.history.push(URL.HANDSHAKE_DISCOVER);
        const result = predictionhandshake.createMarket(Number(this.state.creatorFee), this.state.resolutionSource, this.state.closingTime, this.state.reportingTime, this.state.disputeTime, response.data[0].id);
        console.log(result);
      },
      errorFn: (response) => {
        response.message && this.props.showAlert({
          message: <div className="text-center">{response.message}</div>,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {},
        });
      },
    });
  }
  submitBettingEvent= (values) => {
    console.log(values);
    this.state.eventType === 'new' ? this.submitNewEvent(values) : this.submitOutCome(values);
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
      eventType: 'new',
    });
  }

  resetForm=() => {
    this.setState({
      selectedMatch: '',
      closingTime: '',
      resolutionSource: '',
      reportingTime: '',
      disputeTime: '',
      outcome: '',
      creatorFee: null,
      eventType: '',
      messageType: null,
      message: '',
      key: this.state.key + 1,
      newEventType: '',
    });
  }
  eventsDropdown=() => {
    const defaultMatchId = this.defaultMatch ? this.defaultMatch.id : null;
    const defaultOutcomeId = this.defaultOutcome ? this.defaultOutcome.id : null;
    return (<Dropdown
      key={this.state.key}
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
                this.setState({ selectedMatch: item, values, eventType: 'existing' });
              }
              }
    />);
  }
  render() {
    return (
      <div>
        <Label for="eventName" className="font-weight-bold text-uppercase event-label">Event</Label>
        <SaveBettingEventForm className="save-betting-event" onSubmit={this.submitBettingEvent}>
          {(!this.state.eventType || this.state.eventType === 'existing') && this.state.matches && this.state.matches.length > 0 && <this.eventsDropdown />}
          {!this.state.eventType && <div htmlFor="eventName" className="font-weight-bold text-uppercase or-label text-center">OR</div>}
          {!this.state.eventType && <Button type="button" block className="btnPrimary create-event-button" onClick={this.handleNewEvent}>Create New Event</Button>}
          {this.state.eventType === 'new' && <Field
            name="eventName"
            type="text"
            className="form-control input-event-name input-field"
            placeholder="Event name"
            component={fieldInput}
            value={this.state.eventName}
            validate={[required]}
            onChange={evt => this.updateFormField(evt, 'eventName')}
          />}
          {/* {this.state.eventType === 'new' && <div className="dropdown-new-event-type">
            <Field
              name="walletSelected"
              component={fieldDropdown}
                  // className="dropdown-wallet-tranfer"
              placeholder="Select Event Type"
              defaultText="Select Event Type"
              list={[{ id: 1, text: 'Public' }, { id: 2, text: 'Private' }]}
              onChange={(item) => {
                      this.setState({
                        newEventType: item.text,
                      });
                    }
                    }
            />
          </div>
        } */}
          {this.state.eventType && <Field
            name="outcome"
            type="text"
            className="form-control input-field"
            placeholder="Outcome"
            component={fieldInput}
            value={this.state.outcome}
            onChange={evt => this.updateFormField(evt, 'outcome')}
            validate={[required]}
          />}
          {this.state.eventType === 'new' && (
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
            <DatePicker
              onChange={(date) => { this.changeDate(date, 'closingTime'); }}
              className="form-control input-field"
              placeholder="Closing Time"
              name="closingTime"
            />
            <DatePicker
              onChange={(date) => { this.changeDate(date, 'reportingTime'); }}
              name="reportingTime"
              className={`form-control input-field${!this.state.closingTime ? ' disabled-datePicker' : ' active-DatePicker'}`}
              placeholder="Reporting Time"
              disabled={!this.state.closingTime}
              startDate={this.state.closingTime}
            />
            <DatePicker
              onChange={(date) => { this.changeDate(date, 'disputeTime'); }}
              className={`form-control input-field${!this.state.reportingTime ? ' disabled-datePicker' : ' active-DatePicker'}`}
              placeholder="Dispute Time"
              name="disputeTime"
              startDate={this.state.reportingTime}
              disabled={!this.state.reportingTime}
            />
          </div>
        )}
          {
            this.state.eventType &&
            <div>
              {this.state.eventType === 'new' &&
              <div>
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
              </div>}
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
              <Button type="submit" block className="submit-button">Submit</Button>
              <Button type="button" block className="cancel-button" onClick={this.resetForm}>Cancel</Button>
              <br />
              {this.state.message &&
              <Alert color={this.state.messageType === 'error' ? 'danger' : 'success'}>
                {this.state.message}
              </Alert>}
            </div>
        }
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
  addMatch: bindActionCreators(addMatch, dispatch),
  loadMatches: bindActionCreators(loadMatches, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CreateBettingEvent));
