/* eslint-disable  no-unused-vars */
import React, { Component } from 'react';
import Game from './Game';
import logo from './logo.svg';
import './App.css';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <h1 className="App-intro">
      五子棋
    </h1>
    <Game />
  </div>
);


export default App;
