import './Error.css'
import React from 'react'
import {useSelector} from "react-redux";

const Error = () => {
    const error = useSelector(state => state.error);

    return <div className={(error.isPresent ? "overlay" : "")}>
        <div className={"modal " + (error.isPresent ? "show-modal" : "")}>
            <div className="modal-content">
                <h1>Error</h1>
                <p>{error.message}</p>
            </div>
        </div>
    </div>
}

export default Error;
