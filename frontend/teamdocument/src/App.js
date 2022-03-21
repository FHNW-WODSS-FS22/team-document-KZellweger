import logo from './logo.svg';
import './App.css';
import React from 'react'
import Message from "./components/messages/Message";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>Test: {process.env.REACT_APP_BACKEND_BASE}</p>
        <Message />
      </header>
    </div>
  );
}

export default App;
