import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { login, logout, isLoggedIn } from '../utils/AuthService';
import '../App.css';

class Nav extends Component {
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/">Rotten Tomatoes</Link>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Link to="/">All Movie Ratings</Link>
          </li>
          <li>
            {
              isLoggedIn()  
                    ? <Link to="/create">Add Movies</Link> 
                    :  ''
            }
          </li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
            {
              isLoggedIn() 
                          ? <button className="btn btn-danger log" onClick={() => logout()}>Log out </button> 
                          : <button className="btn btn-info log" onClick={() => login()}>Log In</button>
            }       
        </ul>
      </nav>
    );
  }
}; 

export default Nav;