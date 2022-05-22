import './User.css';
import blank from './blank_user.png'
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import useDebounceMessages from "../../hooks/useDebounceMessages.hook";
import useSendMessagesHook from "../../utils/sendMessagesService";

const User = () => {

    const dispatch = useDispatch()
    const sendMessages = useSendMessagesHook(dispatch);
    const author = useSelector(state => state.author);
    const error = useSelector(state => state.error.isPresent);
    const otherAuthors = useSelector(state => state.otherAuthors);

    const [message, setMessage] = useState([])
    const accumulatedMessages = useDebounceMessages(message, 100)

    useEffect(() => {
        if (typeof accumulatedMessages !== undefined && Array.isArray(accumulatedMessages) && accumulatedMessages.length > 0) {
            sendMessages(accumulatedMessages)
            setMessage([]);
        }
    }, [accumulatedMessages])

    const handleAuthorChange = e => {
        e.preventDefault()
        const json = {
            id: author.id,
            name: author.name,
            image: author.image
        }
        const payload = {...json, name: e.target.value}
        dispatch({type: 'UPDATE_AUTHOR', payload})
        const newMessage = {
            type: 'UPDATE_AUTHOR',
            payload: JSON.stringify(payload),
            sender: author.id
        }
        setMessage([...message, newMessage])
    }

    const imageIsNullOrUndefined = (image) => {
        return(image === null || image === undefined);
    }

    return (
        <div className="userContainer">
            <div className="user">
                <div className="circular">
                    <img src={imageIsNullOrUndefined(author.image) ? blank : author.image} alt="Profile image"/>
                </div>
                <div className="name">
                    <input disabled={error} type="text" value={author.name} className="divider-color"
                           onChange={handleAuthorChange}/>
                    <p><em className="secondary-text-color">{author.id}</em></p>
                </div>
            </div>
            <div className="otherUser">
                {
                    otherAuthors
                        .filter(a => a.id !== author.id)
                        .map(a =>
                            <div className="circular" key={a.id} id={a.id}>
                                <img src={imageIsNullOrUndefined(a.image) ? blank : a.image} alt="Profile image" title={a.name ? a.name : "UNKNOWN"}/>
                            </div>)
                }
            </div>
        </div>
    )
}

export default User;
