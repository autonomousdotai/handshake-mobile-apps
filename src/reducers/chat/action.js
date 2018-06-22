
import { createAPI } from '@/reducers/action';

export const CHAT_ACTIONS = {
    GET_USER_NAME: 'GET_USER_NAME',
}

export const getUserName = createAPI(CHAT_ACTIONS.GET_USER_NAME);
