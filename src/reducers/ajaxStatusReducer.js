import * as types from '../actions/actionTypes';
import initialStates from './initialState';

function actionTypeEndsInSuccess (type){
  return type.substring(type.length - 8) == '_SUCCESS';
}

export default function ajaxStatusReducer(state = initialStates.ajaxCallsInProgress, action){
  if(action.type == types.BEGIN_AJAX_CALL){
    return state + 1;
  }
  else if(action.type == types.ERROR_AJAX_CALL || actionTypeEndsInSuccess(action.type)){
    return state - 1;
  }
  return state;
}
