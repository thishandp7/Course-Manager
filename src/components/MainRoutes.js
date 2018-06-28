import React from 'react';
import {Switch, Route} from 'react-router-dom';
import HomePage from './homePage/HomePage';
import AboutPage from './aboutPage/AboutPage';
import CoursePage from './coursePage/CoursePage';
import ManageCoursePage from './coursePage/ManageCoursePage';//eslint-disable-line import/no-named-as-default

class MainRoutes extends React.Component{
  render(){
    return(
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/courses" component={CoursePage}/>
        <Route exact path="/course" component={ManageCoursePage}/>
        <Route path="/course/:id" component={ManageCoursePage}/>
        <Route path="/about" component={AboutPage}/>
      </Switch>
    );
  }
}

export default MainRoutes;
