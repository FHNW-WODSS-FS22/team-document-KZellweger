import './App.css';
import React from 'react'
import Error from "./components/error/Error";
import Document from "./components/document/Document";
import Navbar from "./components/navbar/Navbar";

const App = () => {
  return (
    <div className="App" id="app">
        <Error/>
        <Navbar/>
      <Document/>
    </div>
  );
}

export default App;
