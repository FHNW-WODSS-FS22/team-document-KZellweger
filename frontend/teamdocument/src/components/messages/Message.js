import React, {useEffect, useState, useRef} from 'react'
import {sendMessage} from "../../hooks/messages.hook";

// https://www.digitalocean.com/community/tutorials/how-to-call-web-apis-with-the-useeffect-hook-in-react
// https://dev.to/rxjs/fetching-data-in-react-with-rxjs-and-lt-gt-fragment-54h7
const Message = (eventSource) => {

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const mesg = {
            sender: "8f7f292b-ffc9-4aba-a523-6a1d826a6608",
            payload: messageInput
        }
        sendMessage(mesg)
    };

    return(
        <div className="wrapper">
            <h1>Messages</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>New Message</p>
                    <input type="text" onChange={event => setMessageInput(event.target.value)} value={messageInput}/>
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Message
