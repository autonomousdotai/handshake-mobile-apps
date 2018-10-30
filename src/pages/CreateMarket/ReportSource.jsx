import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { required, urlValidator } from '@/pages/CreateMarket/validate';
import { renderField } from './form';

class ReportSource extends React.PureComponent {
  static displayName = 'ReportSource';
  static propTypes = {
    className: PropTypes.string,
    reportList: PropTypes.array,
    disabled: PropTypes.bool,
    dispatchFormAction: PropTypes.func.isRequired,
    fieldName: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    reportList: [],
    disabled: false,
    fieldName: 'reports',
  };

  onChange = () => {
    this.props.dispatchFormAction(this.props.fieldName);
  }

  requireSelect = (i) => required((i || {}).label);

  urlValidator = (i) => urlValidator((i || {}).label);

  renderComponent = (props) => {
    const cls = cx(ReportSource.displayName, {
      [props.className]: !!props.className,
    });
    const textNote = 'You must report the result to close the bet and get your fee.';
    return (
      <div className={cls}>
        <div className="CreateEventFormGroupTitle">REPORT</div>
        <div className="CreateEventFormGroupNote">{textNote}</div>
        <Field
          type="creatableSelect"
          name={props.fieldName}
          className="form-group"
          fieldClass="form-control"
          placeholder="Result URL e.g. livescore.com"
          dataSource={props.reportList}
          disabled={props.disabled}
          onChange={this.onChange}
          validate={[this.requireSelect, this.urlValidator]}
          component={renderField}
        />
      </div>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}


export default ReportSource;
