import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
import IconIdea from '@/assets/images/icon/idea.svg';

import { hsGetTxCount } from '@/services/eth/transaction';

class PexCreateBtn extends Component {
  static displayName = 'PexCreateBtn';
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    const tx = await hsGetTxCount();
    console.log('tx', tx);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const createBtn = document.getElementById('PexCreateBtn');
    if (window.pageYOffset > createBtn.offsetTop) {
      createBtn.classList.add('Sticky');
    } else {
      createBtn.classList.remove('Sticky');
    }
  };

  render() {
    return (
      <div id="PexCreateBtn">
        <div className="Idea">
          <img src={IconIdea} alt="" className="IconIdea" />
          <span>Got your own idea?</span>
        </div>
        <Link to={{ pathname: URL.HANDSHAKE_PEX_CREATOR }}>
          <button className="btn btn-report">Create now</button>
        </Link>
      </div>
    );
  }
}


export default PexCreateBtn;
