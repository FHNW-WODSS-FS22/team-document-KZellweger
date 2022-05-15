import {loginService} from "../../utils/loginService";
import React from "react";
import {useNavigate} from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate()

    const logout = e => {
        loginService.logout();
        navigate("/login");
    }

    return (
        <button className={'logout'} onClick={logout}>Logout</button>
    )
}

export default Logout