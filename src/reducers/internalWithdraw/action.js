import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  LOAD_INTERNAL_WITHDRAW: 'LOAD_INTERNAL_WITHDRAW',
  COMPLETE_INTERNAL_WITHDRAW: 'COMPLETE_INTERNAL_WITHDRAW',
};

export const loadWithdrawList = createAPI(ACTIONS.LOAD_INTERNAL_WITHDRAW);
export const completeWithdraw = createAPI(ACTIONS.COMPLETE_INTERNAL_WITHDRAW);
