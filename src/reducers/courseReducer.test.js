import expect from 'expect';
import courseReducer from './courseReducer';
import * as actions from '../actions/courseActions';

describe("Course Reducer", () => {
  it("should add course when passed CREATE_COURSE_SUCCESS", () => {
      const initalState = [
        {title: "A"},
        {title: "B"}
      ];

      const newCourse = {title: "C"};

      const action = actions.createCourseOnSuccess(newCourse);

      const newState = courseReducer(initalState, action);

      expect(newState.length).toEqual(3);
      expect(newState[0].title).toEqual("A");
      expect(newState[1].title).toEqual("B");
      expect(newState[2].title).toEqual("C");
  });

  it("should update coures when passed UPDATE_COURSE_SUCCESS", () => {
      const initalState = [
        {id:"A", title: "A"},
        {id:"B", title: "B"},
        {id:"C", title: "C"}
      ];

      const newCoures = {id:"B", title: "New Coures"};

      const action = actions.updateCourseOnSuccess(newCoures);

      const newState = courseReducer(initalState, action);
      const updatedCourse = newState.find(course => course.id == newCoures.id);
      const untouchedCourse = newState.find(course => course.id == "A");

      expect(newState.length).toEqual(3);
      expect(updatedCourse.title).toEqual("New Coures");
      expect(untouchedCourse.title).toEqual("A");
  });
});
