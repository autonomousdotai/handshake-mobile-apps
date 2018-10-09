import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { URL } from '@/constants';
import IconIdea from '@/assets/images/icon/idea.svg';
import GA from '@/services/googleAnalytics';

class PexCreateBtn extends React.PureComponent {
  render() {
    return (
      <div id="PexCreateBtn" >
        <div className="Idea">
          <img src={IconIdea} alt="" className="IconIdea" />
          <span>Wanna start a new bet?</span>
        </div>
        <Link
          to={{ pathname: URL.HANDSHAKE_PEX_CREATOR }}
          onClick={() => {
            this.props.dispatch(push(URL.HANDSHAKE_PEX_CREATOR));
            GA.clickCreateOwnEvent();
          }}
        >
          <button className="btn btn-report">Create now</button>
        </Link>
      </div>
    );
  }
}

PexCreateBtn.propTypes = {
  dispatch: PropTypes.func,
}

PexCreateBtn.defaultProps = {
  dispatch: undefined,
}


export default PexCreateBtn;
