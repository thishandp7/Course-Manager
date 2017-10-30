import React from 'react';
import {connect} from 'react-redux';
import * as courseActions from '../../actions/courseActions';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import CourseList from './CourseList';

class CoursePage extends React.Component{
  constructor(props, context){
    super(props, context);

    this.redirectToAddCoursePage = this.redirectToAddCoursePage.bind(this);
  }


  courseRow(course, index){
    return <div key={index}>{course.title}</div>;
  }

  redirectToAddCoursePage() {
    this.context.router.history.push('/course');
  }

  render(){
    const courses = this.props.courses;

    return(
      <div>
        <h1>Courses</h1>
        <input
          type="submit"
          value="Add Course"
          className="btn btn-primary"
          onClick={this.redirectToAddCoursePage}/>
        <CourseList courses={courses}/>
      </div>
    );
  }
}

CoursePage.contextTypes = {
  router: PropTypes.object
};

CoursePage.propTypes = {
  courses: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownState) {
  return{
    courses: state.courses
  };
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePage);
