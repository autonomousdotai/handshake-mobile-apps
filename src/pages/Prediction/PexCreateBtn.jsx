import React from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { URL } from '@/constants';
// import IconIdea from '@/assets/images/icon/idea.svg';
import GA from '@/services/googleAnalytics';

class PexCreateBtn extends React.PureComponent {
  render() {
    return (
      <div id="PexCreateBtn" >
        <div className="Idea">
          {/*<img src={IconIdea} alt="" className="IconIdea" />*/}
          <span>Not what you want to bet on?</span>
        </div>
        <div className="btnCreate"
          onClick={() => {
          this.props.dispatch(push(URL.HANDSHAKE_PEX_CREATOR));
          GA.clickCreateOwnEvent();
          }}
        >Create your own
        </div>
      </div>
    );
  }
}

PexCreateBtn.propTypes = {
  dispatch: PropTypes.func.isRequired,
}


export default PexCreateBtn;
