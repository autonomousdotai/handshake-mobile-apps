import { APP_ACTION } from '@/reducers/app/action';
import $http from '@/services/api';
import { BASE_API } from '@/config';


export const createAPI = INIT => ({
  BASE_URL = BASE_API.BASE_URL, PATH_URL, data, id, more, successFn, errorFn, qs, headers, METHOD,
}) => (dispatch) => {
  //
  dispatch({ type: APP_ACTION.CALLING });

  //
  dispatch({ type: INIT });

  const url = `${BASE_URL}/${PATH_URL}`;

  $http(url, data, id, qs, headers, METHOD).then((response) => {
    //
    console.log('Url, data:', url, data);
    dispatch({ type: APP_ACTION.CALLED });
    
    dispatch({ type: `${INIT}_SUCCESS`, payload: response.data, ...more });
    console.log('SuccessFn:', successFn);
    console.log('Response Data:', response.data);
    if (successFn) successFn(response.data);
  }).catch((e) => {
    //
    dispatch({ type: APP_ACTION.CALLED });

    if (e.message === 'Network Error') {
      dispatch({ type: APP_ACTION.NETWORK_ERROR });
    }

    //
    if (errorFn) errorFn(e);
    dispatch({ type: `${INIT}_FAILED`, payload: e });
  });
};

export default { createAPI };
