import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { required } from '@/pages/CreateMarket/validate';
import { renderField } from '@/pages/CreateMarket/form';
import { Field } from 'redux-form';
import CreatableSelect from 'react-select/lib/Creatable';

export default class EventName extends Component {
  static displayName = 'EventName';
  static propTypes = {
    eventList: PropTypes.array,
    onSelect: PropTypes.func,
  };

  static defaultProps = {
    eventList: [],
    onSelect: undefined,
  };

  renderComponent = (props) => {
    // const eventList = props.eventList.map(i => {
    //   return Object.assign({}, i, {
    //     value: i.id.toString(),
    //     label: i.name,
    //   });
    // });
    const eventList = props.eventList.map(i => ({ ...i, value: i.id.toString(), label: i.name }));
    return (
      <React.Fragment>
        <div className="CreateEventFormGroupTitle">EVENT</div>
        <Field
          type="creatableSelect"
          name="eventName"
          className="form-group"
          fieldClass="form-control"
          placeholder="e.g. UEFA - Spain vs Portugal"
          onChange={props.onSelect}
          dataSource={eventList}
          validate={required}
          component={renderField}
          // getOptionLabel={o => o.name}
          // getOptionValue={o => o.id.toString()}
        />
      </React.Fragment>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}
