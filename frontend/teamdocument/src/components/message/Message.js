import React from 'react'
import './Message.css';
import {useSelector} from "react-redux";

const Message = () => {

    const messages = useSelector(state => state.messages);

    console.log(messages);

    return(
        <div className="wrapper">
            {
                messages.map((m, i) => {
                    return (
                        <p key={i} className={`message ${m}`}>
                            {m}
                        </p>
                    )
                })
            }
        </div>
    )
}

export default Message
