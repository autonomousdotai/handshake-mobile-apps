import React from 'react';
import Icon from '@/guru/components/Icon/Icon';
import Subscriber from '@/guru/components/Subscriber';
import ModalDialog from '@/components/core/controls/ModalDialog';
import SubscribeSVG from '@/assets/images/modal/subscribe.svg';
import { updateLoading } from '@/guru/stores/action';
import { emailSubscriber } from './action';

class EmailSubscribe extends React.Component {
  handleEmailSubscriber({ values }) {
    const { props } = this;
    const { dispatch, referParam } = props;
    dispatch(updateLoading(true));
    if (referParam) {
      return dispatch(emailSubscriber({ ...values, referral_code: referParam }));
    }
    return dispatch(emailSubscriber(values));
  }

  renderEmailSubcribe = (props) => {
    const subscriberProps = {
      isSubmitting: props.isLoading,
      placeHolder: 'Your email',
      buttonText: 'I want FREE 0.03 ETH',
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
          Claim your free bets
        </div>
        <div className="SubscriberDescription">
          To claim 2x <span className="highlight">FREE 0.03ETH</span> bets please enter your email address below:
        </div>
        <Subscriber {...subscriberProps} />
      </ModalDialog>
    );
  }

  render() {
    return this.renderEmailSubcribe(this.props);
  }
}

export default EmailSubscribe;
