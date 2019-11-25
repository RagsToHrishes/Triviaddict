import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav id="homenav">
        <ul>
        <li><Link to="/login">Logout</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/game">Play Now!</Link></li>
        <li><Link to="/leaderboards">Leaderboards</Link></li>
        </ul>
      </nav>
    );
  }
}