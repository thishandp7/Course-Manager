import React from 'react';
import {Link} from 'react-router-dom';

class HomePage extends React.Component{
  render(){
    return(
        <div className="jumbotron">
          <h1>Course Manager</h1>
          <p>A personal Course Manager.</p>
          <Link to="about" className="btn btn-primary btn-lg">Learn more</Link>
        </div>
    );
  }
}

export default HomePage;
