import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  ControlLabel,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import './Searchbar.scss';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';

class Searchbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
    };
  }
  handleInputChange = () => {
    this.setState({
      query: this.search.value,
    });
  };

  render() {
    return (
      <form className="container-search">
        <img
          className="icon-search"
          src={require('@/assets/images/icon/ic_search.svg')}
        />
        <input
          className="search"
          placeholder="Search for..."
          onChange={this.handleInputChange}
        />
        <p>{this.state.query}</p>
      </form>
    );
  }
}

Searchbar.propTypes = {};
Searchbar.defaultProps = {};

export default Searchbar;
