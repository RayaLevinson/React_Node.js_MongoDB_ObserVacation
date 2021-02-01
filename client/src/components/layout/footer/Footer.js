import React from 'react';
import { PROJECT_NAME } from '../../../config/constants';

const Footer = () => {
  return (
    <footer className="row fixed-bottom bg-light">
      <div className="col text-center text-dark py-1">      
            <p> &copy; <span>{new Date().getFullYear()}</span> {PROJECT_NAME}. All Rights Reserved.</p> 
      </div>
    </footer>    
  )
}

export default Footer;
