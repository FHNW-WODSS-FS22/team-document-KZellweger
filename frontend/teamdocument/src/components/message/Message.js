import React from 'react'
import {useSelector} from "react-redux";

const Message = () => {

    const messages = useSelector(state => state.messages);

    return(
        <div className="wrapper">
            { messages.map((m, i) => { return <p key={i}>{m}</p>}) }
        </div>
    )
}

export default Message
