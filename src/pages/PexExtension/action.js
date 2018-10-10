import { SET_DATA } from '@/stores/data-action';

export const ExtensionSubscribe = (payload = {}) => {
  return {
    type: 'PREDICTION:EXTENSION_SUBSCRIBE',
    ...payload,
  };
};

export const updateSubscribeResult = (result) => {
  return SET_DATA({
    type: 'PREDICTION:UPDATE_SUBSCRIBE_EXTENSION',
    _path: 'ui.subscribeExtension',
    _value: result,
  });
};
