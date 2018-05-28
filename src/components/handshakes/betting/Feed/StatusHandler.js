
export const BETTING_STATUS = 
    { NOT_CREATE: -4, INITING: -1, INITED: 0, SHAKED: 1, CLOSED: 2, CANCELLED: 3, 
    INITIATOR_WON: 4, BETOR_WON: 5, DRAW: 6, ACCEPTED: 7, REJECTED: 8, DONE: 9}


const BETTING_STATUS_LABEL = 
    { INITING: 'Initing', 
    INITED: 'Inited', SHAKE: 'Shake', CLOSE: 'Close bet', CANCEL: 'Cancel', 
    WITHDRAW: 'Withdraw', 'WAITING_RESULT': 'Waiting Result', REJECT: 'Reject', LOSE: 'Lose',
    RESOLVING: 'Resolving'}


export const ROLE = {
    PAYEE: 0,
    PAYER: 1,
    GUEST: 2
  }

export class BetStatusHandler {
    
    static getStatusLabel(status, role, eventDate){
        //TO DO: Show combobox for use choose an option if evendate < today
        var strStatus = null;
        var strAction = null;
        console.log('Input Role:', role);
        console.log('Status:', status);
        switch (status){
            case BETTING_STATUS.INITING:
            strStatus = BETTING_STATUS_LABEL.INITING; //All users
            strAction = null;
            break;
            case BETTING_STATUS.INITED:
            strStatus = null //Check if payee = '', else payer = '' and show button Shake
            strAction = (role === ROLE.PAYEE) ? BETTING_STATUS_LABEL.CLOSE :  BETTING_STATUS_LABEL.SHAKE;
            break;
            case BETTING_STATUS.SHAKED:
            strStatus = null //Check if payee = '', else payer = '' and show button Shake
            strAction = (role === ROLE.PAYEE) ? BETTING_STATUS_LABEL.CLOSE :  BETTING_STATUS_LABEL.SHAKE;
            //TO DO: current date > event date show options
            break;
            case BETTING_STATUS.CLOSED:
            strStatus = BETTING_STATUS_LABEL.WAITING_RESULT; //All users
            strAction = null;
            //TO DO: current date > event date show options
            break;
            case BETTING_STATUS.CANCELLED:
            strStatus = BETTING_STATUS_LABEL.WAITING_RESULT; //All users
            strAction = null;
            break;
            case BETTING_STATUS.INITIATOR_WON:
            strStatus = (role === ROLE.PAYEE)? null : (role === ROLE.PAYER) ? BETTING_STATUS_LABEL.LOSE : BETTING_STATUS_LABEL.DONE; //If payeee = Withdraw, else payer = "lose" show button "Withdraw"
            strAction = (role === ROLE.PAYEE) ? BETTING_STATUS_LABEL.WITHDRAW : null;
            break;
            case BETTING_STATUS.BETOR_WON: 
            strStatus = (role === ROLE.PAYEE) ? BETTING_STATUS_LABEL.LOSE : (role === ROLE.PAYER) ? null : BETTING_STATUS_LABEL.DONE; // If payee = "lose", else payer = "withdraw"
            strAction = (role === ROLE.PAYEE) ? BETTING_STATUS_LABEL.WITHDRAW : null;
            break;
            case BETTING_STATUS.DRAW:
            strStatus = (role === ROLE.GUEST) ? BETTING_STATUS_LABEL.DONE : null; // Both payee/payer = "withdraw"
            strAction = (role !== ROLE.GUEST) ? BETTING_STATUS_LABEL.WITHDRAW : null; 
            break;
            case BETTING_STATUS.REJECTED:
            strStatus = BETTING_STATUS_LABEL.RESOLVING;
            strAction = null;
            break;
            default: // Not show status
            break;
    
        }
        console.log('Output Status:', strStatus);
        console.log('Output Action:', strAction);

        return {'status': strStatus, 'action': strAction};
    
    }
    static controlStatus(isOwner, eventDate){

    }
    static isShowResultOptions(isMine, eventDate){
        if(isMine){
            var today = new Date()
           if (today > eventDate){
               return true;
           }
        }
        return false;

    }
    static shakeItem(role, eventDate, shakeAmount,goal,balance, item){
        console.log('Shake Amount:',shakeAmount);
        console.log('Goal:', goal);
        console.log('Balance:',balance);
        if (role === ROLE.PAYER || role === ROLE.GUEST){
            //handle shake item, for payee
            /*
            if balance = total amount => close bet
            if date > event date, payee can't shake 
            User shake, deposit money into escrow. Return result
            */
           var today = new Date()
           if (today <= eventDate){
               // Change item to status 
               let newItem = item;
               const newBalance = shakeAmount + balance;
                console.log('New Balance:',newBalance);
               if(newBalance < goal){
                newItem.status = BETTING_STATUS.SHAKED;
               }else {
                   newItem.status = BETTING_STATUS.CLOSED;
               }
               newItem.balance = newBalance;
               return newItem;
           }
        }
        return null;
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

    static closeItem(role, evendate, currentDate, item){
        /*
        User tap Close Bet button or auto Close
        */
       if (role === ROLE.PAYEE){
            // TO DO: Change item to Close. Update status
            let newItem = item;
            newItem.status = BETTING_STATUS.CLOSED;
            return newItem;
       }
       return null;
    }
    static rejectItem(){

    }
    static chooseWhoWin(){
        
    }
    
}

