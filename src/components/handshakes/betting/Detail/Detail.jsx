import React from 'react';
import PropTypes from 'prop-types';

import './Detail.scss';

const regex = /\[.*?\]/g;
const regexReplace = /\[|\]/g;
const regexReplacePlaceholder = /\[.*?\]/;


class BettingDetail extends React.Component {
    static propTypes = {
     
    }
    static defaultProps = {
      


    }
    constructor(props) {
      super(props);
      this.state = {
      };
    }
   
    render() {
      return (
        <div/>
      );
    }
}

export default BettingDetail;
