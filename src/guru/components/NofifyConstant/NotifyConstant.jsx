import React from 'react';
import { PropTypes } from 'prop-types';
import ModalDialog from '@/components/core/controls/ModalDialog';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';

import Button from '@/components/core/controls/Button';

import {
    getEstimateGas,
    getBalance
  } from '@/components/handshakes/betting/utils.js';

import './NotifyConstant.scss';
class NofifyConstant extends React.Component {
    static propTypes = {
        modalNotifyConstant: PropTypes.object,
        onAgreeClick: PropTypes.func,
        onCancelClick: PropTypes.func
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);
        this.state = {
            estimatedGas: 0,
            balance: 0,
        };
    }

    async componentDidMount() {
        const estimatedGas = await getEstimateGas();
        const balance = await getBalance();
        console.log('componentDidMount modalNotifyConstant:', this.props.modalNotifyConstant);
        this.setState({
          estimatedGas,
          balance
        });
    }

    handleCancelClick = () => {
        this.props.onCancelClick();
    }

    handleAgreeClick = () => {
        console.log('handleAgreeClick');
        const { estimatedGas, balance } = this.state;
        if(estimatedGas < balance) {
            const handler = BetHandshakeHandler.getShareManager();
            //TO DO: call contract 
            this.props.onAgreeClick(true);
        }else {
            this.props.onAgreeClick(false);
        }

        // const { modalNotifyConstant } = this.props;
        // modalNotifyConstant.close();
        
    }

    renderNotifiConstant = (props) => {
        const { estimatedGas } = this.state;
        return (
            <ModalDialog
            close
            className="EmailSubscriberModal"
            onRef={props.modalNotifyConstant}
            > 
                <div className="NotifiyDescription">You can place a bet or create event free in CONSTANT. We need your permission and it may take about {estimatedGas} ETH at first time.</div>
                <div className="NotifiyWrapperButtons">
                    <Button className="cancelBtn" onClick={this.handleCancelClick}>No</Button>
                    <Button className="agreeBtn" onClick={this.handleAgreeClick}>Yes, I agree</Button>
                </div>
            </ModalDialog>
        );
        
    }

    render() {
        return this.renderNotifiConstant(this.props);
    }
}
export default NofifyConstant;
