import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// services
import { setHeaderTitle } from '@/reducers/app/action';
// components
import FAQBetting from '@/components/core/presentation/FAQBetting';
import BettingFilter from '@/components/handshakes/betting/Feed/Filter';
// style
import './Detail.scss';

class BettingDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: -1,
      outCome: -1,
    };
    // set header
    props.setHeaderTitle(props.slug || 'Detail');
  }

  parseQueryString() {
    let str = window.location.search;
    let objURL = {};

    str.replace(
      new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
      ( $0, $1, $2, $3 ) => {
        objURL[$1] = $3;
      }
    );
    return objURL;
  }

  componentDidMount() {
    // init data
    const { match, out_come:outCome } = this.parseQueryString();
    this.setState({
      match: parseInt(match),
      outCome: parseInt(outCome),
    });
  }

  render() {
    const { match, outCome } = this.state;
    return (
      <div className="beeting-detail">
        <BettingFilter matchId={match} outComeId={outCome} />
        <div className="faq-block">
          <FAQBetting />
        </div>
      </div>
    );
  }
}

BettingDetail.propType = {
  setHeaderTitle: PropTypes.func,
};

const mapDispatch = ({
  setHeaderTitle,
});

export default connect(null, mapDispatch)(BettingDetail);
