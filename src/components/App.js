import React from 'react';
import {BrowserRouter, Route, withRouter} from 'react-router-dom';
import HomePage from './homePage/HomePage';
import AboutPage from './aboutPage/AboutPage';
import NavBar from './NavBar';
import MainRoutes from './MainRoutes';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class App extends React.Component{
  render(){
    return(
      <div>
          <NavBar loading={this.props.loading} />
          <MainRoutes />
      </div>
    );
  }
}

App.propTypes = {
  loading: PropTypes.bool.isRequired
};

function mapStateToProps(state, ownProps){
  return {
    loading: state.ajaxCallsInProgress > 0
  };
}

export default withRouter(connect(mapStateToProps)(App));
