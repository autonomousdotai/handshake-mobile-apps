import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';

import ReportSource from './ReportSource';
import Debug from './Debug';
import './CreateEvent.scss';

class CreateEvent extends React.Component {
  static displayName = 'CreateEvent';
  static propTypes = {
    classNames: PropTypes.string
  };

  static defaultProps = {
    classNames: ''
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOnSubmit = props => {
    console.log('props: ', props);
    // (values, actions) => {
    //   setTimeout(() => {
    //     alert(JSON.stringify(values, null, 2));
    //     actions.setSubmitting(false);
    //   }, 1000);
    // }
  };

  buildBlockTitle = title => {
    return <p className="BlockTitle">{title}</p>;
  };

  renderEventTitle = formProps => {
    const { values } = formProps;
    return (
      <div className="Block">
        {this.buildBlockTitle('Gurus will predict YES or NO')}
        <label htmlFor="outcomeName">Will</label>
        <Field
          name="outcomeName"
          placeholder="Manchester United beat Juventus"
        />
        <label htmlFor="eventName">in</label>
        <Field name="eventName" placeholder="Champions League table stage" />
        <label className="switch">
          <Field name="public" type="checkbox" checked={values.public} />
          <div className="slider round">
            <span className="on">Public</span>
            <span className="off">Private</span>
          </div>
        </label>
      </div>
    );
  };

  render() {
    const cls = cx(CreateEvent.displayName, {
      [this.props.classNames]: this.props.classNames
    });

    const initialValues = { outcomeName: '', eventName: '', public: true };

    return (
      <div className={cls}>
        <Formik initialValues={initialValues} onSubmit={this.handleOnSubmit}>
          {formProps => {
            const { isSubmitting } = formProps;
            return (
              <Form>
                {this.renderEventTitle(formProps)}
                <ReportSource />
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
                <Debug props={formProps} />
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default CreateEvent;
