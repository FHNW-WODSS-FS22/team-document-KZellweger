import './App.css';
import React from 'react'
import Error from "./components/error/Error";
import Document from "./components/document/Document";
import Navbar from "./components/navbar/Navbar";
import {
    BrowserRouter,
    Routes,
    Route, Navigate
} from "react-router-dom";
import Login from "./components/login/Login";
import {DocumentWrapper} from "./components/DocumentWrapper";
import {useSelector} from "react-redux";

const App = () => {
    return (
        <BrowserRouter>
            <div className="App" id="app">
            <Error/>
            <Routes>

                <Route path={'/'} element={<DocumentWrapper/>}/>
                <Route path={'/login'} element={<Login/>}/>
            </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
