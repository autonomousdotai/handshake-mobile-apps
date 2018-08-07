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
 * Validator email address
 * @param value
 */
export const email = (value) => {
  return !isEmail(value) ? ('Invalid email address') : null;
};

/**
 * Validator URL
 * @param value
 */
export const urlValidator = (value) => {
  return isURL(value) ? null : ('Invalid URL');
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

export const allFieldHasData = (value, allValues) => {
  return !allValues.outcomes.find(i => Object.keys(i).length > 0) ? 'Required' : null;
}
