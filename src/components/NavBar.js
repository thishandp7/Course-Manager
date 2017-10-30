import React from 'react';
import {NavLink} from 'react-router-dom';
import LoadingDots from './common/LoadingDots';
import PropTypes from 'prop-types';

const NavBar = ({loading}) => {
    return(
      <nav>
        <NavLink exact activeClassName="active" to="/">Home</NavLink>
        {" | "}
        <NavLink activeClassName="active" to="/courses">Courses</NavLink>
        {" | "}
        <NavLink activeClassName="active" to="/about">About</NavLink>
        {loading && <LoadingDots interval={100} dots={20}/>}
      </nav>
    );
};

NavBar.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default NavBar;
