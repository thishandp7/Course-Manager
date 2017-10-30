import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';
import toastr from 'toastr';
import {authersFormattedForDropdown} from '../../selectors/selector';

export class ManageCoursePage extends React.Component {
  constructor(props, context){
    super(props, context);

    this.state = {
      course: Object.assign({}, props.course),
      errors: {},
      saving: false
    };

    this.updateCourseState = this.updateCourseState.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.course.id != nextProps.course.id) {
      this.setState({course: Object.assign({}, nextProps.course)});
    }
  }

  updateCourseState(event){
    const field = event.target.name;
    let course = Object.assign({}, this.state.course);
    course[field] = event.target.value;
    return this.setState({course: course});
  }

  courseFormIsValid(){
    let formIsValid = true;
    let errors = {};

    if(this.state.course.title.length < 5){
      formIsValid = false;
      errors.title = "Title must be at least 5 characters.";
    }

    this.setState({errors: errors});
    return formIsValid;
  }

  saveCourse(event) {
    event.preventDefault();

    if(!this.courseFormIsValid()){
      return;
    }

    this.setState({saving: true});
    this.props.actions.saveCourse(this.state.course)
    .then(() => this.redirect())
    .catch(error => {
      toastr.error(error);
      this.setState({saving: false});
    });
  }

  redirect() {
    this.setState({saving: false});
    toastr.success("Course saved");
    this.context.router.history.push('/courses');
  }

  render(){
    return(
      <CourseForm
        allAuthors={this.props.authors}
        onChange={this.updateCourseState}
        onSave={this.saveCourse}
        course={this.state.course}
        errors={this.state.errors}
        loading={this.state.saving}
      />
    );
  }
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

ManageCoursePage.contextTypes = {
  router: PropTypes.object
};

function getCourseById(courses, courseId){
  const currentCourse = courses.filter(course => course.id == courseId);
  return currentCourse.length > 0 ? currentCourse[0] : null;
}

function mapStateToProps(state, ownProps){
  let course = {id:'', watchHref:'', title:'', authorId:'', length:'', category:''};
  const courseId = ownProps.match.params.id;

  if(courseId && state.courses.length > 0){
    course = getCourseById(state.courses, courseId);
  }

  return{
    course: course,
    authors: authersFormattedForDropdown(state.authors)
  };
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
