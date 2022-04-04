import React, {useEffect, useState} from 'react'
import {sendMessage} from "../../hooks/messages.hook";

// https://www.digitalocean.com/community/tutorials/how-to-call-web-apis-with-the-useeffect-hook-in-react
// https://dev.to/rxjs/fetching-data-in-react-with-rxjs-and-lt-gt-fragment-54h7
function Message() {

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        // TODO: Wrap in observable
        const eventSource = new EventSource(process.env.REACT_APP_BACKEND_BASE + '/document');
        eventSource.onmessage = msg => console.log(msg.data);
        eventSource.onerror = err => console.log(err);
        return () => eventSource.close()
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(JSON.stringify([messageInput]));
        sendMessage(messageInput)
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
