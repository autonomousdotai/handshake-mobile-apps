import { SET_DATA } from './data-action';

export default {
  preFetch({ _path, type }) {
    return SET_DATA({
      _path,
      type: `PRE_${type}`,
      _value: {
        _meta: {
          isFetching: true,
        },
      },
    });
  },
  postFetch({ _path, type, _key, _value }) {
    const data = (_key && _value) ? { [_key]: _value } : {};
    return SET_DATA({
      _path,
      type: `POST_${type}`,
      _value: {
        ...data,
        _meta: {
          isFetching: false,
        },
      },
    });
  },
};
