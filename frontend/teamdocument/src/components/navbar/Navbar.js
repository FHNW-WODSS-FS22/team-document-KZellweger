import './Navbar.css';
import React from 'react';
import Logout from "./Logout";
import {useSelector} from "react-redux";
import Paragraph from "../document/paragraph/Paragraph";

const Navbar = () => {
    return (
        <div className="navbar dark-primary-color">
            <h1 className="text-primary-color">Google Docs Light</h1>
            <Logout />
        </div>
    )
}

export default Navbar;