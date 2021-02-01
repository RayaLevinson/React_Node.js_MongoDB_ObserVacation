import React from 'react';
import { Link } from 'react-router-dom';
import { PROJECT_NAME } from '../../config/constants';

const Landing = () => {
  return (
    <div className="row mx-3 mb-5">
      <div className="card col-sm-12 col-md-8 col-lg-6 mx-auto mb-5">
      <div className="card-body pb-5 px-4">       
        <div className="text-center">   
          <h2 className="text-success pb-4">Enjoy {PROJECT_NAME}</h2>
          <Link to="/login">
            <button type="button" className="btn btn-success btn-block">Login</button>        
          </Link>
          <br/>
          <Link to="/register">
            <button type="button" className="btn btn-success btn-block">Register</button>                 
          </Link>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Landing;
