// Write by Phuong

import React from 'react';
import PropTypes from 'prop-types';

import './Input.scss';

class Input extends React.PureComponent {

  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.any,
    type: PropTypes.string,
    onRef: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    meta: PropTypes.object,
    checkError: PropTypes.bool,
  }
    
  constructor(props) {
    super(props);    
    this.state = {
        value: this.props.value || ""
    }   
  }

  componentDidMount() {
   
  }

  componentWillUnmount() {
   
  }  

  handleChange(event) {
    this.setState({value: event.target.value}, ()=>{
        if(this.props.onChange) this.props.onChange(this.state.value);
    })
  }

  render() {      
    const { type, name, meta, placeholder, onRef, className, checkError, ...props } = this.props;

    let inRef = onRef || ((div) => this.inputRef = div);

    let errorClass = '';
    if (checkError && meta.error) {
      errorClass = 'input-error';
    }
     
    return (
        
        <div className="form-input">
            <label> 
                <input
                {...props}
                className={`form-control ${errorClass} ${className || ''}`}
                type={type || 'text'}
                name={name}
                ref={inRef}
                />
                <span className="placeholder">{placeholder|| ''}</span>
            </label>
        </div>
    );
  }
}

export default Input;
