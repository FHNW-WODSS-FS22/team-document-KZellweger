import './App.css';
import React from 'react'
import Error from "./components/error/Error";
import Document from "./components/document/Document";
import Navbar from "./components/navbar/Navbar";
import {
    BrowserRouter,
    Routes,
    Route, useNavigate,
} from "react-router-dom";
import Login from "./components/login/Login";
import {PrivateRoute} from "./components/login/PrivateRoute";
import {DocumentWrapper} from "./components/DocumentWrapper";

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
