import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { URL } from '@/constants';
import IconIdea from '@/assets/images/icon/idea.svg';
import GA from '@/services/googleAnalytics';

class PexCreateBtn extends React.PureComponent {
  render() {
    console.log('this.props.dispatch', this.props.dispatch);
    return (
      <div id="PexCreateBtn" >
        <div className="Idea">
          {/*<img src={IconIdea} alt="" className="IconIdea" />*/}
          <span>Wanna start a new bet?</span>
        </div>
        <Link
          to={{ pathname: URL.HANDSHAKE_PEX_CREATOR }}
          onClick={() => {
            this.props.dispatch(push(URL.HANDSHAKE_PEX_CREATOR));
            GA.clickCreateOwnEvent();
          }}
        >
          <div className="btnCreate">Create now</div>
        </Link>
      </div>
    );
  }
}

PexCreateBtn.propTypes = {
  dispatch: PropTypes.func.isRequired,
}


export default PexCreateBtn;
