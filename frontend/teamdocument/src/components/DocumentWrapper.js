import React, {useEffect} from "react";
import Navbar from "./navbar/Navbar";
import Document from "./document/Document";
import {Navigate, useNavigate} from "react-router-dom";

export const DocumentWrapper = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const isAuthenticated = !!localStorage.getItem('localUser')
        console.log(isAuthenticated)
        if(!isAuthenticated){
            console.log("should navigitae??")
            navigate('/login')
            return
        }
    },[])


    return(
        <div>
            <Navbar/>
            <Document/>
        </div>
    )
}