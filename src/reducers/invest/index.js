import {ACTIONS} from '@/reducers/invest/action';
export default function(state = {}, action){
    switch(action.type){
        case ACTIONS.FETCH_PROJECTS:
            return {...state, projects: action.payload }
        case ACTIONS.FETCH_PROJECT_DETAIL:
            return {...state, project: action.payload }
        case ACTIONS.FETCH_TRADERS: 
            return {...state, traders: action.payload }
        case ACTIONS.FETCH_TRADER_DETAIL:
            return {...state, trader: action.payload }
        case ACTIONS.SYNC_WALLET: {
            return {...state, syncWallet: action.payload }
        }
        case ACTIONS.SYNCED_INFO: {
            return { ...state, syncedInfo: action.payload }
        }
        case ACTIONS.SM_PROJECT: {
            return { ...state, smProject: action.payload }
        }
        case ACTIONS.SM_PROJECT_FUND_AMOUNT: {
            return { ...state, smProject: { ...state.smProject, fundAmount: action.payload }}
        }
        case ACTIONS.FETCH_TRANSACTIONS: {
            return { ...state, transactions: action.payload }
        }
        default:
            return state
    }

}