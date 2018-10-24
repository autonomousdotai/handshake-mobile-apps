import { createAPI } from '@/reducers/action';

export const ADMIN_ACTIONS = {
  AUTH: 'AUTH',
};

export const ID_VERIFICATION_ACTIONS = {
  GET_LIST: 'id_verification/list',
  UPDATE_STATUS: 'id_verification/update',
};

export const userAuthenticate = createAPI(ADMIN_ACTIONS.AUTH);
export const loadIDVerificationDocuments = createAPI(ID_VERIFICATION_ACTIONS.GET_LIST);
export const updateIDVerificationDocument = createAPI(ID_VERIFICATION_ACTIONS.UPDATE_STATUS);

