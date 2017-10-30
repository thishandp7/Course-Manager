import * as types from './actionTypes';

export function beginAjaxCall() {
  return {type: types.BEGIN_AJAX_CALL};
}

export function errorAjaxCall() {
  return {type: types.ERROR_AJAX_CALL};
}
