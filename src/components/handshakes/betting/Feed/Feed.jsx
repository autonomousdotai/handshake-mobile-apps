import React from 'react';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Feed from '@/components/core/presentation/Feed';
import BettingShake from './Shake';

class FeedBetting extends React.Component {
  render() {
    return (
      <div>
        {/* Feed */}
        <Feed className="feed" handshakeId={this.props.id} onClick={this.props.onFeedClick}>
          <p className="description">{this.props.description}</p>
          <div className="bottomWrapper">
            <div className="email">{this.props.from_email}</div>
            <div className="email">80%</div>
          </div>
        </Feed>
        {/* Shake */}
        <Button block onClick={() => { this.modalBetRef.open(); }}>Shake now</Button>
        {/* Modal */}
        <ModalDialog title="Make a bet" onRef={modal => this.modalBetRef = modal}>
          <BettingShake
            remaining={10}
            odd={0.1}
            onCancelClick={() => this.modalBetRef.close()}
            onSubmitClick={() => this.modalBetRef.close()}
          />
        </ModalDialog>
      </div>
    );
  }
}

export default FeedBetting;

