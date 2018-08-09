import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './CreateMarket.scss';
import { hasEmail } from './selector';
import EmailForm from './EmailForm';
import CreateEventContainer from './CreateEventContainer';

class CreateMarket extends React.Component {
  static displayName = 'CreateMarket';
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    hasEmail: PropTypes.bool,
  };

  static defaultProps = {
    hasEmail: false,
  };

  renderComponent = (props) => {
    return (!props.hasEmail) ? <EmailForm /> : <CreateEventContainer />;
  };

  render() {
    return (
      <div className={CreateMarket.displayName}>
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      hasEmail: hasEmail(state),
    };
  },
)(CreateMarket);
