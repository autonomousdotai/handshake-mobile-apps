import React from 'react';
import { connect } from 'react-redux';
import Icon from '@/guru/components/Icon/Icon';
import Subscriber from '@/guru/components/Subscriber';
import ModalDialog from '@/components/core/controls/ModalDialog';
import SubscribeSVG from '@/assets/images/modal/subscribe.svg';
import { updateLoading } from '@/guru/stores/action';
import { emailSubscriber } from './action';

class EmailSubscribe extends React.Component {
  handleEmailSubscriber = ({ values }) => {
    const { props } = this;
    const { dispatch, referParam } = props;
    // dispatch(updateLoading(true));
    if (referParam) {
      return dispatch(emailSubscriber({ ...values, referral_code: referParam }));
    }
    return dispatch(emailSubscriber(values));
  }

  renderEmailSubcribe = (props) => {
    const subscriberProps = {
      isSubmitting: props.isLoader,
      placeHolder: 'Your email',
      buttonText: 'Submit',
      buttonClasses: 'btn btn-primary',
      statusSubscribe: props.statusSubscribe,
      handleSubmit: this.handleEmailSubscriber
    };
    return (
      <ModalDialog
        close
        className="EmailSubscriberModal"
        onRef={props.modalEmailSubscribe}
      >
        <Icon path={SubscribeSVG} className="SubscriberImage" />
        <div className="SubscriberTitle">
          Claim your bets
        </div>
        <div className="SubscriberDescription">
          Want to receive updates and ninja freebies? No spam, ever.
        </div>
        <Subscriber {...subscriberProps} />
      </ModalDialog>
    );
  }

  render() {
    return this.renderEmailSubcribe(this.props);
  }
}

export default connect(
  (state) => {
    return {
      isLoader: state.guru.ui.isLoading
    };
  },
)(EmailSubscribe);
