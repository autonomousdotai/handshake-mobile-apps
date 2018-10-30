import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import isInt from 'validator/lib/isInt';
import trim from 'validator/lib/trim';

/**
 * Validator empty value of control
 * @param value
 */
export const required = (value) => {
  return (!trim((value || '').toString())) ? 'Required' : null;
};

/**
 * Validator Email address
 * @param value
 */
export const emailValidator = (value) => {
  return !isEmail(value) ? ('Invalid email address') : null;
};

/**
 * Validator URL
 * @param value
 */
export const urlValidator = (value = '') => {
  return isURL(value.toString()) ? null : ('Invalid URL');
};

/**
 * Validator Int with min-max
 * @param value
 * @param min
 * @param max
 */
export const intValidator = (value, min, max) => {
  return isInt(value.toString(), { min, max }) ? null : (`Please enter an integer number from ${min} to ${max}`);
};

/**
 * Validator isExists in source
 * @param value
 * @param name
 * @param source
 */
export const isExists = (value, name, source) => {
  const isFilter = source.filter(item => item[name] === value);
  return (isFilter && isFilter.length) ? `The ${name} is taken` : null;
};

/**
 * Validator Email Code
 */
export const codeValidator = () => ('Invalid Code');
