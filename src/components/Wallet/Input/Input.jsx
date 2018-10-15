// Write by Phuong

import React from 'react';
import PropTypes from 'prop-types';

import './Input.scss';

class Input extends React.PureComponent {
    
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
    const { type, name, meta, placeholder, className, ...props } = this.props;        
    return (
        
        <div className="form-input">
            <label> 
                <input
                {...props}
                onChange={this.handleChange.bind(this)}                
                value={this.state.value}
                className={`${className || ''}`}
                type={type || 'text'}
                name={name|| ""}
                />
                <span className="placeholder">{placeholder|| ''}</span>
            </label>
        </div>
    );
  }
}

Input.propTypes = {
  value: PropTypes.string,  
  placeholder: PropTypes.string,  
  onChange: PropTypes.func,  
};

export default Input;
