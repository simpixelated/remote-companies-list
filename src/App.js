import React, { Component } from 'react';

import CompaniesList from './Companies'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <header className="App-header">
          <h1 className="App-title">Remote Companies</h1>
        </header>
        <CompaniesList />
      </div>
    );
  }
}

export default App;
