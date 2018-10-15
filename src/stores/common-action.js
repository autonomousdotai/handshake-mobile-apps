import React from 'react';
import { APP_ACTION } from '@/reducers/app/action';
import { SET_DATA } from './data-action';

export const showAlert = ({ message, timeOut = 3000, type = 'danger' }) => {
  return {
    type: APP_ACTION.SHOW_ALERT,
    payload: {
      isShow: true,
      timeOut,
      type,
      message: <div className="text-center">{message}</div>,
    },
  };
}

export const gasCheck = (result) => {
  return SET_DATA({
    _path: 'blockChain.insufficientGas',
    type: 'CHECK_GAS',
    _value: result,
  });
}
