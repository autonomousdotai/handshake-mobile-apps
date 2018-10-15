import { uniqBy } from '@/utils/array';
import { ACTIONS } from './action';

// const TAG = 'InternalWithdrawReducer';
const internalAdminReducter = (
  state = {
    orderList: [],
    page: null,
  },
  action,
) => {
  switch (action.type) {
    case `${ACTIONS.LOAD_INTERNAL_ADMIN_CASH_ORDER}_SUCCESS`:
      if (action?.payload?.data) {
        let newList = [...state?.orderList, ...action?.payload?.data];
        newList = uniqBy(newList, item => item.id);
        return {
          ...state,
          orderList: newList,
        };
      }
      return state;
    case `${ACTIONS.INTERNAL_ADMIN_SEND_CASH_ORDER}_SUCCESS`:
      if (action?.payload?.data) {
        const payloadData = action?.payload?.data || {};
        const foundIndex = state?.orderList?.findIndex(item => item.id === payloadData.id);
        const newList = [...state.orderList];
        if (foundIndex !== -1) {
          newList[foundIndex] = payloadData;
        }
        return {
          ...state,
          orderList: newList,
        };
      }
      return state;
    default:
      return state;
  }
};

export default internalAdminReducter;

