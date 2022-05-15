import './User.css';
import blank from './blank_user.png'
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import useDebounceMessages from "../../hooks/debounce.hook";
import sendMessages from "../../utils/messageService";

const User = () => {
    const dispatch = useDispatch()
    const author = useSelector(state => state.author);
    const error = useSelector(state => state.error.isPresent);
    const [message, setMessage] = useState([])
    const accumulatedMessages = useDebounceMessages(message,100, 25)

    useEffect(() => {
        if(typeof accumulatedMessages!== undefined && Array.isArray(accumulatedMessages) && accumulatedMessages.length > 0){
            console.log("Send and clean")
            sendMessages(accumulatedMessages)
            setMessage([]);
        }
    },[accumulatedMessages])

    const handleAuthorChange = e => {
        e.preventDefault()
        const json = {
            id: author.id,
            name: author.name,
            image: author.image
        }
        const payload = { ...json , name: e.target.value }
        dispatch({type: 'UPDATE_AUTHOR', payload})
        const newMessage = {
            type: 'UPDATE_AUTHOR',
            payload: JSON.stringify(payload),
            sender: author.id
        }
        setMessage([...message, newMessage])
    }

    return (
        <div className="user">
            <div className="circular">
                <img src={author.image === undefined ? blank : author.image} alt="Profile image" />
            </div>
            <div className="name">
                <input disabled={error} type="text" value={author.name} className="divider-color" onChange={handleAuthorChange}/>
                <p><em className="secondary-text-color">{author.id}</em></p>
            </div>
        </div>
    )
}

export default User;
