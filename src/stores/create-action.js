import invariant from '@/utils/invariant';
import { isFunction, isObject, isUndefined } from '@/utils/is';

/**
 * Flux Standard Action utilities for Redux.
 * @param _type
 * @param payloadCreator
 * @param metaCreator
 * @returns {function(...[*])}
 */
export default function createAction(_type, payloadCreator = v => v, metaCreator) {
  invariant(
    isFunction(payloadCreator) || isUndefined(payloadCreator),
    'Expected payloadCreator to be a function or undefined',
  );

  invariant(
    isFunction(metaCreator) || isObject(metaCreator) || isUndefined(metaCreator),
    'Expected metaCreator to be a function or object or undefined',
  );

  const finalPayLoadCreator = (firstArgs, ...args) => {
    return (firstArgs instanceof Error) ? firstArgs : payloadCreator(firstArgs, ...args);
  };

  return (args) => {
    const payload = finalPayLoadCreator(args);
    const action = { type: `${_type}/${args.type}` };

    if (payload instanceof Error) {
      action.error = true;
    }

    if (!isUndefined(payload)) {
      action.payload = payload;
    }

    if (metaCreator) {
      action.meta = isFunction(metaCreator) ? metaCreator(args) : metaCreator;
    }

    return action;
  };
}
