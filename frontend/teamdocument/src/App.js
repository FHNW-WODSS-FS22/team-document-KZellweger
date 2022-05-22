import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import Error from './components/error/Error';
import DocumentWrapper from './components/DocumentWrapper';

function App() {
  return (
    <BrowserRouter>
      <div className="App" id="app-container">
        <Error />
        <Routes>
          <Route path="/" element={<DocumentWrapper />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
