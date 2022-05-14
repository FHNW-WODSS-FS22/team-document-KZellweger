import React, {useEffect} from "react";
import Navbar from "./navbar/Navbar";
import Document from "./document/Document";
import {Navigate, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

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