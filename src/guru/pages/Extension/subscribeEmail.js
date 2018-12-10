import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Subscriber from '@/guru/components/Subscriber/';
import { apiSubscribeEmail } from '@/guru/stores/action';

class subscribeEmail extends React.PureComponent {
  static propTypes = {
    apiSubscribeEmail: PropTypes.func.isRequired
  };

  state = {
    isSubscribed: false
  };

  onSubmit = ({ values, setErrors }) => {
    const bodyFormData = new FormData();
    bodyFormData.set('email', values.email);
    bodyFormData.set('product', 'prediction');

    this.props
      .apiSubscribeEmail({
        data: bodyFormData
      })
      .then(res => {
        console.log('res', res);
        this.setState({ isSubscribed: true });
      })
      .catch(e => {
        console.error('e', e);
        setErrors({ email: e.message });
      });
  };

  renderComponent = state => {
    if (state.isSubscribed) {
      return (
        <span className="Subscribed">
          Thanks, stay tuned for updates from the Ninja team
        </span>
      );
    }
    return (
      <React.Fragment>
        <span>Sign up for our newsletter</span>
        <Subscriber
          placeHolder="Your email address"
          buttonText="Count me in"
          handleSubmit={this.onSubmit}
          statusSubscribe
        />
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="SubScribeEmail">{this.renderComponent(this.state)}</div>
    );
  }
}

export default connect(
  null,
  { apiSubscribeEmail }
)(subscribeEmail);
