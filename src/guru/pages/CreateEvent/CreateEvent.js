import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';

import Debug from './Debug';

class CreateEvent extends React.Component {
  static displayName = 'CreateEvent';
  static propTypes = {
    classNames: PropTypes.string,
  };

  static defaultProps = {
    classNames: '',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOnSubmit = (props) => {
    console.log('props: ', props);
    // (values, actions) => {
    //   setTimeout(() => {
    //     alert(JSON.stringify(values, null, 2));
    //     actions.setSubmitting(false);
    //   }, 1000);
    // }
  }

  renderEventTitle = (props) => {
    return (
      <React.Fragment>
        <label htmlFor="outcome">
          Will
        </label>
        <Field name="outcome" placeholder="Email" />
        <label htmlFor="eventName">
          in
        </label>
        <Field name="eventName" placeholder="event Name" />
      </React.Fragment>
    );
  }

  render() {
    const cls = cx(CreateEvent.displayName, {
      [this.props.classNames]: this.props.classNames,
    });

    return (
      <div className={cls}>
        <Formik
          initialValues={{ outcome: 'jared', eventName: '123' }}
          onSubmit={this.handleOnSubmit}
        >
          {
            (props) => {
              const { isSubmitting } = props;
              return (
                <Form>
                  {this.renderEventTitle(props)}
                  <button type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                  <Debug props={props} />
                </Form>
              );
            }
          }
        </Formik>
      </div>
    );
  }
}

export default CreateEvent;
