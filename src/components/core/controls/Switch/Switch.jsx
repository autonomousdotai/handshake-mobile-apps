import React from 'react';
import PropTypes from 'prop-types';
// component
import './Switch.scss';

class Switch extends React.Component {
  constructor(props) {
    super(props);     
    this.state = {
      isChecked: this.props.isChecked || false
    }
  }

  onChange = () =>{
    const {onClick} = this.props || null;     
    this.setState({ isChecked: !this.state.isChecked}, () => {
      console.log("after click", this.state.isChecked);
      if (onClick) onChange(this.state.isChecked);
    });    
  }

  render() {    
    
    return (
      
      <div className="switch-component">
          <label className="switch">
            <input type="checkbox" defaultChecked={this.state.isChecked} onChange={this.onChange} />
            <span className="slider round"></span>
          </label>
      </div>
    );
  }
}

Switch.propType = {
  onClick: PropTypes.func,  
  isChecked: PropTypes.bool,
}

export default Switch;
