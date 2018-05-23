import axios from 'axios';
import { HANDSHAKE_API } from '@/config';

const $http = (api, data, token = '', id) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  return axios.create({
    baseURL: HANDSHAKE_API.BASE_URL,
    timeout: HANDSHAKE_API.TIMEOUT,
    withCredentials: true,
    headers,
  })[api.method](`${api.path}${id ? `${id}/` : ''}`, data);
};

export default $http;
