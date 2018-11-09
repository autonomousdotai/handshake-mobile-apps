import { APP_ACTION } from '@/reducers/app/action';
import $http from '@/services/api';
import { BASE_API } from '@/constants';
import axios from 'axios';

export const createAPI = INIT => ({
  BASE_URL = BASE_API.BASE_URL,
  PATH_URL,
  METHOD = 'GET',
  id,
  data,
  more,
  successFn,
  errorFn,
  qs,
  headers,
  ...rest
}) => (dispatch) => {
  dispatch({ type: APP_ACTION.CALLING });

  dispatch({ type: INIT });

  const url = `${BASE_URL}/${PATH_URL}`;

  // console.log(`app - api - calling - id${requestUuid}`, `${METHOD}:${PATH_URL}`);

  $http({
    url, data, id, qs, headers, method: METHOD, ...rest,
  }).then((response) => {
    // console.log(`app - api - called - id${requestUuid}`);
    dispatch({ type: APP_ACTION.CALLED });
    if (response.data.status === 1 || response.data.status === 200) {
      dispatch({ type: `${INIT}_SUCCESS`, payload: response.data, ...more });
      if (successFn) successFn(response.data);
    } else {
      dispatch({ type: `${INIT}_FAILED`, payload: response.data });
      if (errorFn) errorFn(response.data);
    }
  }).catch((e) => {
    // console.log(`app - api - called - id${requestUuid}`);
    dispatch({ type: APP_ACTION.CALLED });
    if (e.message === 'Network Error') { dispatch({ type: APP_ACTION.NETWORK_ERROR }); }

    if (errorFn) errorFn(e);
    dispatch({ type: `${INIT}_FAILED`, payload: e });
  });
};

export const axiosInstance = axios.create({
  baseURL: 'http://35.198.235.226:9000/api',
  timeout: 5000
})

export const timoAPI = axios.create({
  baseURL: 'https://my.timo.vn',
  timeout: 5000
})

export default { createAPI };
