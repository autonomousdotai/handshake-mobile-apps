import { sprintf } from 'sprintf-js';

function validateEmail(email) {
  // eslint-disable-next-line
  const re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  return re.test(email);
}

// Enum
const error = { // eslint-disable-line
  REQUIRED: 1,
  EMAIL: 2,
  CHAR_COMPARE_GT: 3,
  CHAR_COMPARE_LT: 4,
  NUMBER_COMPARE_GT: 5,
  NUMBER_COMPARE_LT: 6,
  CONFIRM_PASSWORD: 7,
  IN_LIST: 8,
};

const errorText = {};
errorText[error.get('REQUIRED')] = '%1$s is required';
errorText[error.get('EMAIL')] = '%1$s must be valid';
errorText[error.get('CHAR_COMPARE_GT')] = '%1$s must be length then %2$s chars';
errorText[error.get('CHAR_COMPARE_LT')] = '%1$s must be small then %2$s chars';
errorText[error.get('NUMBER_COMPARE_GT')] = '%1$s must be larger then %2$s';
errorText[error.get('NUMBER_COMPARE_LT')] = '%1$s must be smaller then %2$s';
errorText[error.get('CONFIRM_PASSWORD')] = 'Password does not match the confirm password';
errorText[error.get('IN_LIST')] = '%1$s must be valid';

const valid = {
  required: value => (value ? '' : error.get('REQUIRED')),
  email: value => (validateEmail(value) ? '' : error.get('EMAIL')),
  char_compare_gt: gt => value => ((value.length >= gt) ? '' : error.get('CHAR_COMPARE_GT')),
  char_compare_lt: lt => value => ((value.length < lt) ? '' : error.get('CHAR_COMPARE_LT')),
  number_compare_gt: gt => value => ((value.length >= gt) ? '' : error.get('NUMBER_COMPARE_GT')),
  number_compare_lt: lt => value => ((value.length < lt) ? '' : error.get('NUMBER_COMPARE_LT')),
  confirm_password: password => value => ((value === password) ? '' : error.get('CONFIRM_PASSWORD')),
  in_list: (list, id = '') => value =>
    ((!id ? list.indexOf(value) > 0 : list.filter(item => item[id] === value).length > 0)
      ? ''
      : error.get('IN_LIST')),
};

const composeValidators = (...validators) => value =>
  validators.reduce((_error, validator) => _error || validator(value), undefined);

valid.merge = composeValidators;
valid.text = (val, ...agru) => sprintf(errorText[val], ...agru);
valid.blankText = text => val => (val ? text : '');
valid.shouldValid = bool => _valid => ((bool) ? _valid : '');

export default valid;
