import React from 'react'
import {useSelector} from "react-redux";

const Error = () => {
    const error = useSelector(state => state.error);

    return error.isPresent ? <div>{error.message}</div> : "";
}

export default Error;
