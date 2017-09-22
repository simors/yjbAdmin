import {createAction as createActionImpl} from 'redux-actions';

export function createAction(type) {
  return (payload) => {
    payload = (payload === undefined) ? {} : payload;
    return createActionImpl(type)(payload);
  };
}
