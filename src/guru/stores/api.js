import { call, put } from 'redux-saga/effects';
import $http from '@/services/api';
import { BASE_API } from '@/constants';

const apiActionRequest = ({ type }) => ({
  type: `${type}_REQUEST`
});

const apiActionSuccess = ({ type }) => ({
  type: `${type}_SUCCESS`
});

const apiActionFailed = ({ type }) => ({
  type: `${type}_FAILURE`
});

/**
 * Call API
 * @param method POST/GET (apiGet/apiPost)
 * @param type action type
 * @param data The payload sent to server
 * @param headers custom configs of header
 * @param BASE_URL The base url of website
 * @param PATH_URL API endpoint
 * @returns {*} status = 0 => error, else => data
 */
function* callApi({
  method,
  type,
  data,
  headers,
  BASE_URL = BASE_API.BASE_URL,
  PATH_URL
}) {
  if (!PATH_URL) throw new Error('URL is required');
  if (!type) throw new Error('Action type is required');

  const url = `${BASE_URL}/${PATH_URL}`;
  yield put(apiActionRequest({ type }));

  try {
    const response = yield call($http, { url, data, method, headers });
    // TODO: wrong api doesn't return data = []
    // TODO: status = 0 doesn't return msg
    if (response.status === 200) {
      yield put(apiActionSuccess({ type }));
      return response.data;
    }
    console.error('callAPI (status): ', response);
    return { status: 0, message: response.statusText };
  } catch (e) {
    console.error('failed to callAPI: ', e);
    yield put(apiActionFailed({ type }));
    return { status: 0, message: 'Network Error' };
  }
}

function* apiGet(actions) {
  return yield callApi({
    ...actions,
    method: 'GET',
    // TODO: chrome-extension
    headers:
      window.self !== window.top
        ? {
          ...actions.headers,
          'Request-From': 'extension'
        }
        : { ...actions.headers }
  });
}

function* apiPost(actions) {
  return yield callApi({ ...actions, method: 'POST' });
}

function* apiPostForm(actions) {
  return yield callApi({
    ...actions,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export { apiGet, apiPost, apiPostForm, callApi };
