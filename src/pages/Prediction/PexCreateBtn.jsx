import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
import IconIdea from '@/assets/images/icon/idea.svg';

class PexCreateBtn extends Component {
  static displayName = 'PexCreateBtn';

  async componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
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
