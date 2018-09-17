import { call, put } from 'redux-saga/effects';
import $http from '@/services/api';
import { BASE_API } from '@/constants';
import apiAction from '@/stores/api-action';
import { isFunction } from '@/utils/is';

/**
 * Call API
 * @param _path The location of Store which will be updated
 * @param _key The key of _value in store
 * @param _value The returned value that will be saved in state
 * @param BASE_URL The base url of website
 * @param PATH_URL API endpoint
 * @param method POST/GET (apiGet/apiPost)
 * @param data The payload sent to server
 * @returns {*}
 */
function* callApi({ _path, _key, type, method, data, BASE_URL = BASE_API.BASE_URL, PATH_URL, successFn, errorFn }) {
  if (!PATH_URL) throw new Error('URL is required');
  if (!type) throw new Error('Action type is required');
  if (_path) yield put(apiAction.preFetch({ _path, type }));
  const url = `${BASE_URL}/${PATH_URL}`;
  let respondedData = {}; // { status, result, error }
  try {
    const response = yield call($http, { url, data, method });
    if (response.status === 200) {
      respondedData = { status: response.data.status, data: response.data.data };
    } else {
      console.error('callAPI (status): ', response);
      respondedData = { status: response.status, error: response.statusText };
    }
    return respondedData;
  } catch (error) {
    console.error('callAPI: ', error);
    respondedData = { error };
    return respondedData;
  } finally {
    if (respondedData.error) {
      if (errorFn && isFunction(errorFn)) errorFn(respondedData);
    } else if (successFn && isFunction(successFn)) {
      successFn(respondedData);
    }
    if (_path) {
      yield put(apiAction.postFetch({
        _path,
        type,
        _key: _key || 'list',
        _value: respondedData.data,
      }));
    }
  }
}

function* apiGet(actions) {
  return yield callApi({ ...actions, method: 'GET' });
}

function* apiPost(actions) {
  return yield callApi({ ...actions, method: 'POST' });
}

export { apiGet, apiPost, callApi };
