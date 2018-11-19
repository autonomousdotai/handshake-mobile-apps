import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CustomField from '@/guru/components/Form/CustomField';
import { ErrorMessage, Field } from 'formik';
import { loadReports } from './action';
import { reportSelector } from './selector';

class ReportSource extends React.Component {
  static displayName = 'ReportSource';
  static propTypes = {
    classNames: PropTypes.string,
    loadReports: PropTypes.func,
    disabled: PropTypes.bool,
    reports: PropTypes.array
  };

  static defaultProps = {
    classNames: '',
    disabled: false,
    reports: [],
    loadReports: undefined
  };

  componentDidMount() {
    this.props.loadReports();
  }

  render() {
    const { classNames, reports, disabled } = this.props;
    const cls = cx(ReportSource.displayName, {
      [classNames]: classNames
    });
    return (
      <div className={cls}>
        <Field
          type="reselect"
          name="source"
          placeholder="Result URL e.g. livescore.com"
          disabled={disabled}
          options={reports}
          component={CustomField}
        />
        <ErrorMessage name="source">
          {msg => <div className="ErrMsg">{msg.label}</div>}
        </ErrorMessage>
      </div>
    );
  }
}

export default connect(
  state => ({
    reports: reportSelector(state)
  }),
  { loadReports }
)(ReportSource);
