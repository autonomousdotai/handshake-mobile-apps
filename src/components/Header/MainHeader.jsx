import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import history from '@/services/history';
import backBtn from '@/assets/images/icon/header-back.svg.raw';
import { clickHeaderBack } from '@/reducers/app/action';

class MainHeader extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    clickHeaderBack: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.back = ::this.back;
  }

  back(e) {
    if (e.keyCode) {
      if (e.keyCode === 13) {
        this.props.clickHeaderBack();
        history.goBack();
      }
    } else {
      this.props.clickHeaderBack();
      history.goBack();
    }
  }

  render() {
    return (
      <header className="header">
        <div
          tabIndex={0}
          role="button"
          className={`header-back-btn ${this.props.app.headerBack ? 'visibled' : ''}`}
          onClick={this.back}
          onKeyDown={this.back}
          dangerouslySetInnerHTML={{ __html: backBtn }}
        />
        <div className="title">{this.props.app.headerTitle}</div>
        <div className="header-right">
          {this.props.app.headerRightContent}
        </div>
      </header>
    );
  }
}

export default connect(state => ({ app: state.app }), ({ clickHeaderBack }))(MainHeader);
