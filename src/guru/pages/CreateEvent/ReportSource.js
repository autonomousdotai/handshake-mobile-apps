import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CustomField from '@/guru/components/Form/CustomField';
import { ErrorMessage, Field } from 'formik';
import { loadReports } from './action';
import { reportSelector } from './selector';

class ReportSource extends React.Component {
  static propTypes = {
    loadReports: PropTypes.func,
    disabled: PropTypes.bool,
    reports: PropTypes.array
  };

  static defaultProps = {
    disabled: false,
    reports: [],
    loadReports: undefined
  };

  componentDidMount() {
    this.props.loadReports();
  }

  render() {
    const { reports, disabled } = this.props;
    return (
      <React.Fragment>
        <Field
          type="reselect"
          name="source"
          className="CreatableSelectSource"
          placeholder="Result URL e.g. livescore.com"
          disabled={disabled}
          options={reports}
          component={CustomField}
        />
        <ErrorMessage name="source">
          {msg => <div className="ErrMsg">{msg.label}</div>}
        </ErrorMessage>
      </React.Fragment>
    );
  }
}

export default connect(
  state => ({
    reports: reportSelector(state)
  }),
  { loadReports }
)(ReportSource);
