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
import { Label } from 'reactstrap';
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

  submitBettingEvent= (values) => {
    console.log(values);
    const url = API_URL.CRYPTOSIGN.ADD_OUTCOME.concat(`/${this.state.selectedMatch.id}`);
    const a = this.props.loadMatches({
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

  render() {
    const defaultMatchId = this.defaultMatch ? this.defaultMatch.id : null;
    const defaultOutcomeId = this.defaultOutcome ? this.defaultOutcome.id : null;
    return (
      <div>
        <SaveBettingEventForm className="save-betting-event" onSubmit={this.submitBettingEvent}>
          <Label for="eventName" className="font-weight-bold text-uppercase event-label">Event</Label>
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
                this.setState({ selectedMatch: item, values });
              }
              }
          />}
          <Field
            name="eventName"
            type="text"
            className="form-control input-event-name input-field"
            placeholder="Event name"
            component={fieldInput}
            value={this.state.eventName}
            onChange={evt => this.updateFormField(evt, 'eventName')}
          />
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
          <Label for="reporting" className="font-weight-bold text-uppercase reporting-label">Reportings</Label>
          <Field
            name="reportingSource"
            type="text"
            className="form-control input-field"
            placeholder="Resolution source"
            component={fieldInput}
            value={this.state.resolutionSource}
            onChange={evt => this.updateFormField(evt, 'resolutionSource')}

          />
          <DatePicker onChange={(date) => { this.changeDate(date, 'closingTime'); }} className="form-control input-field" placeholder="Closing Time" />
          <DatePicker onChange={(date) => { this.changeDate(date, 'reportingTime'); }} className="form-control input-field" placeholder="Reporting Time" />
          <DatePicker onChange={(date) => { this.changeDate(date, 'disputeTime'); }} className="form-control input-field" placeholder="Dispute Time" />
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
          <Label for="feesDesc" className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis aliquid iure illum dolor asperiores. </Label>
          <Label for="referralFee" className="font-weight-bold text-uppercase fees-label">Referral</Label>
          <Field
            name="referralFee"
            type="number"
            className="form-control input-field"
            placeholder="Referral Fee"
            component={fieldInput}
            value={this.state.referralFee}
            onChange={evt => this.updateFormField(evt, 'referralFee')}

          />
          <Label for="reffeesDesc" className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. </Label>
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
