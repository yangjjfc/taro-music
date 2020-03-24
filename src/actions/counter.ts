import {
  ADD,
  MINUS
} from '../constants/counter';

export const add = () => ({
    type: ADD
  });
export const minus = () => ({
    type: MINUS
  });

// 异步的action
export function asyncAdd () {
  return dispatch => {
    setTimeout(() => {
      dispatch(add());
    }, 2000);
  };
}
