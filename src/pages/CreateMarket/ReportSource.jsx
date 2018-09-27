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
  };

  static defaultProps = {
    className: '',
    reportList: [],
    disabled: false,
  };

  renderComponent = (props) => {
    const cls = cx(ReportSource.displayName, {
      [props.className]: !!props.className,
    });
    const reportList = props.reportList.map(i => ({ ...i, value: i.id.toString(), label: i.url }));
    const validate = props.isNew ? [required, urlValidator] : [];
    const textNote = 'You must report the result to close the bet and get your fee.';
    return (
      <div className={cls}>
        <div className="CreateEventFormGroupTitle">REPORT</div>
        <div className="CreateEventFormGroupNote">{textNote}</div>
        <Field
          type="creatableSelect"
          name="reports"
          className="form-group"
          fieldClass="form-control"
          placeholder="Result URL e.g. livescore.com"
          // onSelect={this.reportSelected}
          dataSource={reportList}
          disabled={props.disabled}
          validate={validate}
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
