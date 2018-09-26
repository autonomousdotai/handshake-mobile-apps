import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { required } from '@/pages/CreateMarket/validate';
import { renderField } from '@/pages/CreateMarket/form';
import { Field } from 'redux-form';

export default class EventName extends Component {
  static displayName = 'EventName';
  static propTypes = {
    eventList: PropTypes.array,
  };

  static defaultProps = {
    eventList: [],
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //   };
  // }

  renderComponent = (props) => {
    console.log('props.eventList', props.eventList);
    return (
      <React.Fragment>
        <div className="CreateEventFormGroupTitle">EVENT</div>
        <Field
          type="creatableSelect"
          name="eventName"
          className="form-group"
          fieldClass="form-control"
          placeholder="e.g. UEFA - Spain vs Portugal"
          // onSelect={props.onSelect}
          dataSource={props.eventList}
          validate={required}
          component={renderField}
        />
      </React.Fragment>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}
