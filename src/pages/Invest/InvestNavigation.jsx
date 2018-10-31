import React, { Component } from 'react';
import ExpandArrowSVG from './back-arrow.svg';

export default class InvestNavigation extends Component {
  constructor(props) {
    super(props);
  }

  handleBackClick = () => {
    console.log('back pressed');
    this.props.history.goBack();
  }
  render() {
    return (
      <div
        style={{
        backgroundColor: '#fff',
        height: '43px',
        padding: '13px 0',
      }}
        className="clearfix"
      >
        <button
          type="button"
          className="btn-transparent"
          style={{
          float: 'left',
          width: '19px',
          position: 'relative',
          left: '1em',
          zIndex: 10000,
          padding: 0,
          top: '-4px',
          }}
          onClick={this.handleBackClick}
        ><img
          src={ExpandArrowSVG}
          alt="arrow"
        />
        </button>
        <h6 style={{
          position: 'relative',
          left: '-19px',
          textAlign: 'center',
        }}
        >
          {this.props.header}
          Detail
        </h6>
      </div>
    );
  }
}
