import './App.css';
import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./components/login/Login";
import {DocumentWrapper} from "./components/DocumentWrapper";

const App = () => {
    return (
        <BrowserRouter>
            <div className="App" id="app">
            {/*<Error/>*/}
            <Routes>
                <Route path={'/'} element={<DocumentWrapper/>}/>
                <Route path={'/login'} element={<Login/>}/>
            </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
