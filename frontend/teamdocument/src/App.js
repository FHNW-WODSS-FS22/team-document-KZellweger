import './App.css';
import React, {useEffect, useRef} from 'react'
import Document from "./components/Document";
import Navbar from "./components/navbar/Navbar";

const App = () => {
  return (
    <div className="App" id="app">
      <Navbar/>
      <Document/>
    </div>
  );
}

export default App;
