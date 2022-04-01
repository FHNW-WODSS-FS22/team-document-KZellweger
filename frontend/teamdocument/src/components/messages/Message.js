import React, {useEffect, useState} from 'react'
import {getMessages, sendMessage} from "../../hooks/messages.hook";

// https://www.digitalocean.com/community/tutorials/how-to-call-web-apis-with-the-useeffect-hook-in-react
function Message() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        let mounted = true;
        getMessages()
            .then(messages => {
                if(mounted) {
                    setMessages(messages)
                }
            })
        return () => mounted = false;
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(messageInput)
    };

    return(
        <div className="wrapper">
            <h1>Messages</h1>
            <ul>
                {messages.map(message => <li key={message}>{message}</li>)}
            </ul>
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