import { uniqBy } from '@/utils/array';
import { ACTIONS } from './action';

// const TAG = 'InternalWithdrawReducer';
const internalWithdrawReducter = (
  state = {
    list: [],
  },
  action,
) => {
  switch (action.type) {
    case `${ACTIONS.LOAD_INTERNAL_WITHDRAW}_SUCCESS`:
      if (action?.payload?.data) {
        let newList = [...state?.list, ...action?.payload?.data];
        newList = uniqBy(newList, item => item.id);
        newList = newList.sort((a, b) => {
          if (a.status === b.status) {
            return new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1;
          }
          return a.status > b.status ? 1 : -1;
        });
        return {
          ...state,
          list: newList,
        };
      }
      return state;
    case `${ACTIONS.COMPLETE_INTERNAL_WITHDRAW}_SUCCESS`:
      if (action?.payload?.data) {
        const payloadData = action?.payload?.data || {};
        const foundIndex = state?.list?.findIndex(item => item.id === payloadData.id);
        const newList = [...state.list];
        if (foundIndex !== -1) {
          newList[foundIndex] = payloadData;
        }
        return {
          ...state,
          list: newList,
        };
      }
      return state;
    default:
      return state;
  }
};

export default internalWithdrawReducter;

