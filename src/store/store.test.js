import expect from 'expect';
import {createStore} from 'redux';
import rootReducers from '../reducers/index';
import initalState from '../reducers/initialState';
import * as courseActions from '../actions/courseActions';

describe("Store", () => {
  it("Should handle creating courses", () => {
    const store = createStore(rootReducers, initalState);

    const course = {
      title: "Clean Code"
    };

    store.dispatch(courseActions.createCourseOnSuccess(course));
    const states = store.getState();

    const expectedCourse = {
      title: "Clean Code"
    };

    expect(states.courses[0]).toEqual(expectedCourse);
  });
});
