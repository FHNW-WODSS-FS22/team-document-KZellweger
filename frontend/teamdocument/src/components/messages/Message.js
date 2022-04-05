import React, {useEffect, useState, useRef} from 'react'
import {sendMessage} from "../../hooks/messages.hook";
import {useSelector} from "react-redux";

// https://www.digitalocean.com/community/tutorials/how-to-call-web-apis-with-the-useeffect-hook-in-react
// https://dev.to/rxjs/fetching-data-in-react-with-rxjs-and-lt-gt-fragment-54h7
const Message = (eventSource) => {

    const messages = useSelector(state => state.messages);

    return(
        <div className="wrapper">
            <h1>Messages</h1>
            { messages.map((m, i) => { return <p key={i}>{m}</p>}) }
        </div>
    )
}

export default Message
