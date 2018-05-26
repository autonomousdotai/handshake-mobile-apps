
export const BETTING_STATUS = Object.freeze(
    { NOT_CREATE: -4, INITING: -1, INITED: 0, SHAKED: 1, CLOSED: 2, CANCELLED: 3, 
    INITIATOR_WON: 4, BETOR_WON: 5, DRAW: 6, ACCEPTED: 7, REJECTED: 8, DONE: 9}
);

export const BETTING_STATUS_LABEL = Object.freeze(
    { INITING: 'Initing', 
    INITED: 'Inited', SHAKE: 'Shake', CLOSE: 'Close bet', CANCEL: 'Cancel', 
    WITHDRAW: 'Withdraw', 'WAITING_RESULT': 'Waiting Result', REJECT: 'Reject', LOSE: 'Lose',
    RESOLVING: 'Resolving'}
);

export class StatusHandler {
    
    static getStatusLabel(status, isOwner){
        //TO DO: Show combobox for use choose an option if evendate < today
        var strStatus = null;
        var strAction = null;

        switch (status){
            case BETTING_STATUS.INITING:
            strStatus = BETTING_STATUS_LABEL.INITING; //All users
            break;
            case BETTING_STATUS.INITED || BETTING_STATUS.SHAKED:
            strStatus = isOwner ? BETTING_STATUS_LABEL.INITED : null; //Check if payee = Inited, else payer = '', show button Shake
            strAction = isOwner ? BETTING_STATUS_LABEL.CLOSE :  BETTING_STATUS_LABEL.SHAKE;
            break;
            case BETTING_STATUS.CLOSED || BETTING_STATUS.CANCELLED:
            strStatus = BETTING_STATUS_LABEL.WAITING_RESULT; //All users
            break;
            case BETTING_STATUS.INITIATOR_WON:
            strStatus = isOwner ? null : BETTING_STATUS_LABEL.LOSE; //If payeee = Withdraw, else payer = "lose" show button "Withdraw"
            strAction = isOwner ? BETTING_STATUS_LABEL.WITHDRAW : null;
            break;
            case BETTING_STATUS.BETOR_WON: 
            strStatus = isOwner ? BETTING_STATUS_LABEL.LOSE : null; // If payee = "lose", else payer = "withdraw"
            strAction = isOwner ? null : BETTING_STATUS_LABEL.WITHDRAW;
            break;
            case BETTING_STATUS.DRAW:
            strStatus = BETTING_STATUS_LABEL.WITHDRAW; // Both payee/payer = "withdraw"
            break;
            case BETTING_STATUS.REJECTED:
            strStatus = BETTING_STATUS_LABEL.RESOLVING;
            break;
            default: // Not show status
            break;
    
        }

        return {'status': strStatus, 'action': strAction};
    
    }
    static shakeItem(isOwner, eventDate){
        if (!isOwner){
            //handle shake item, for payee
            /*
            if balance = total amount => close bet
            if date > event date, payee can't shake 
            User shake, deposit money into escrow. Return result
            */
           var today = new Date()
           if (today <= eventDate){
               // TO DO: Shake item
           }
        }
        
    }

    static autosCloseItem(isOwner, eventDate){
        if(isOwner){
            //TODO: Close item
            var today = new Date()
            if (today > eventDate){
                this.closeItem(isOwner);
            }
        }
    }

    static closeItem(isOwner){
        /*
        User tap Close Bet button or auto Close
        */
       if (isOwner){
            // TO DO: Change item to Close. Update status
       }
    }
    static rejectItem(){

    }
    static chooseWhoWin(){
        
    }
    
}

