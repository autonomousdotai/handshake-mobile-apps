import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CustomField from '@/guru/components/Form/CustomField';
import { Field } from 'formik';
import { loadReports } from './action';

class ReportSource extends React.Component {
  static displayName = 'ReportSource';
  static propTypes = {
    classNames: PropTypes.string,
    loadReports: PropTypes.func,
    disabled: PropTypes.bool,
    reports: PropTypes.array.isRequired
  };

  static defaultProps = {
    classNames: '',
    disabled: false,
    loadReports: undefined
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

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
          name="reportSource"
          component={CustomField}
          type="reselect"
          data={reports}
          disabled={disabled}
          placeholder="Result URL e.g. livescore.com"
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    reports: state.guru.reports
  }),
  { loadReports }
)(ReportSource);
