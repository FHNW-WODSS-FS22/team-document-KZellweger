import React from "react";
import Navbar from "./navbar/Navbar";
import Document from "./document/Document";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

export const DocumentWrapper = () => {

    const isAuthenticated = useSelector(state => state.isAuthenticated);
    return (
        <div>
            {isAuthenticated ?
                <div>
                    <Navbar/>
                    <Document/>
                </div> :
                <Navigate to={"/login"}/>}
        </div>
    )
}