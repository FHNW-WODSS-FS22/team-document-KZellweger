import React, {useEffect, useState} from 'react'
import {sendMessage} from "../../hooks/messages.hook";
import {fromFetch} from "rxjs/fetch";

// https://www.digitalocean.com/community/tutorials/how-to-call-web-apis-with-the-useeffect-hook-in-react
function Message() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        fromFetch(process.env.REACT_APP_BACKEND_BASE + '/message')
            .subscribe(response =>
                response.json().then(
                    data => {
                        console.log(data)
                        setMessages(data)
                    })
            );
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault();
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