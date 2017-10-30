import * as types from './actionTypes';
import courseApi from '../api/mockCourseApi';
import {beginAjaxCall, errorAjaxCall} from './ajaxStatusActions';

export function loadCoursesSuccess(courses) {
  return {type: types.LOAD_COURSES_SUCCESS, courses};
}

export function updateCourseOnSuccess(course) {
  return {type: types.UPDATE_COURSE_SUCCESS, course};
}

export function createCourseOnSuccess(course) {
  return {type: types.CREATE_COURSE_SUCCESS, course};
}

export function loadCourses(){
  return function(dispatch){
    dispatch(beginAjaxCall());
    return courseApi.getAllCourses().then(courses => {
        dispatch(loadCoursesSuccess(courses));
    }).catch(err => {
      throw(err);
    });
  };
}

export function saveCourse(course){
  return dispatch => {
    dispatch(beginAjaxCall());
    return courseApi.saveCourse(course).then(savedCourse => {
      course.id ? dispatch(updateCourseOnSuccess(savedCourse)) : dispatch(createCourseOnSuccess(savedCourse));
    }).catch(err => {
      dispatch(errorAjaxCall());
      throw(err);
    });
  };
}
