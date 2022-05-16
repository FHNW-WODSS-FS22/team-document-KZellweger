import './Navbar.css';
import React from 'react';
import Logout from "./Logout";
import {useSelector} from "react-redux";
import Paragraph from "../document/paragraph/Paragraph";

const Navbar = () => {

    const otherAuthors = useSelector(state => state.otherAuthors);



    return (
        <div className="navbar dark-primary-color">
            <h1 className="text-primary-color">Google Docs Light</h1>
            <Logout />
            <h1> Authors </h1>
            {
                otherAuthors
                    .map(a => <p className="text-primary-color" key={a.id} id={a.id}>{a.name}</p>)
            }
        </div>
    )
}

export default Navbar;