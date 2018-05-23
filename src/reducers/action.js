import { APP_ACTION } from '@/reducers/app/action';
import $http from '@/services/api';

export const createAPI = ({
  API, INIT, SUCCESS, FAILED,
}) => ({
  token, data, id, more, successFn, errorFn,
}) => (dispatch) => {
  dispatch({ type: INIT });
  dispatch({ type: APP_ACTION.CALLING });
  $http(API, data, token, id).then((response) => {
    dispatch({ type: APP_ACTION.CALLED });
    dispatch({ type: SUCCESS, payload: response.data, ...more });
    if (successFn) successFn(response.data);
  }).catch((e) => {
    dispatch({ type: APP_ACTION.CALLED });
    if (e.message === 'Network Error') {
      dispatch({ type: APP_ACTION.NETWORK_ERROR });
    }
    if (errorFn) errorFn(e);
    dispatch({ type: FAILED, payload: e });
  });
};

export default { createAPI };
