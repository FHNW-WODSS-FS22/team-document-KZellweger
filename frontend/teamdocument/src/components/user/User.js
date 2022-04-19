import './User.css';
import blank from './blank_user.png'
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../../hooks/messages.hook";

const User = () => {
    const dispatch = useDispatch()
    const author = useSelector(state => state.author);

    // TODO image is not updated, thus lost after name change: Do we want images?
    const handleAuthorChange = e => {
        e.preventDefault()
        const json = {
            id: author.id,
            name: author.name
        }
        const payload = { ...json , name: e.target.value }
        dispatch({type: 'UPDATE_AUTHOR', payload})

        sendMessage({
            type: 'UPDATE_AUTHOR',
            payload: JSON.stringify(payload),
            sender: author.id
        });
    }

    return (
        <div className="user">
            <div className="circular">
                <img src={author.image === undefined ? blank : author.image} alt="Profile image" />
            </div>
            <div className="name">
                <input type="text" value={author.name} className="divider-color" onChange={handleAuthorChange}/>
                <p><em className="secondary-text-color">{author.id}</em></p>
            </div>
        </div>
    )
}

export default User;