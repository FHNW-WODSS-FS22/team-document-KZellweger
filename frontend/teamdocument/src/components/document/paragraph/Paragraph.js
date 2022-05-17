import './Paragraph.css';
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import RemoveParagraphButton from "../RemoveParagraphButton";
import useDebounceMessages from "../../../hooks/useDebounceMessages.hook";
import useSendMessagesHook from "../../../utils/sendMessagesService";

/* eslint-disable react/prop-types */
const Paragraph = ({id}) => {

    const error = useSelector(state => state.error.isPresent);
    const author = useSelector(state => state.author);
    const paragraph = useSelector(state => state.paragraphs.find(p => id === p.id));
    const paragraphs = useSelector(state => state.paragraphs);
    const dispatch = useDispatch()

    const sendMessages = useSendMessagesHook(dispatch)

    const [message, setMessage] = useState([])
    const accumulatedMessages = useDebounceMessages(message,150)
    const maxOrdinal = useSelector(state => {
        const ordinals =  state.paragraphs.map(p => p.ordinal)
        return Math.max(...ordinals)
    })

    useEffect(() => {
        if(typeof accumulatedMessages!== undefined && Array.isArray(accumulatedMessages) && accumulatedMessages.length > 0){
            sendMessages(accumulatedMessages)
            setMessage([]);
        }
    },[accumulatedMessages])

    const handleContentChange = e => {
        e.preventDefault()
        const payload =  { ...paragraph, content: e.target.value }
        dispatch({ type: 'UPDATE_PARAGRAPH', payload })
        const newMessage = {
            type: 'UPDATE_PARAGRAPH',
            payload: JSON.stringify(payload),
            sender: author.id,
            correlationId: paragraph.id
        }
        setMessage([...message, newMessage])
    }

    const handleOrdinalChange = e => {
        e.preventDefault()
        if (isNaN(e.target.valueAsNumber)) {
            return;
        }
        const ordinal = e.target.valueAsNumber > maxOrdinal ? maxOrdinal : e.target.valueAsNumber;
        const payload =  [{ ...paragraph, ordinal: ordinal }]
        const sibling = paragraphs.find(p => p.ordinal === ordinal)
        if (sibling) {
            payload.push({ ...sibling, ordinal: paragraph.ordinal })
        }
        dispatch({type: 'UPDATE_PARAGRAPH_ORDINALS', payload})
        sendMessages([{
            type: 'UPDATE_PARAGRAPH_ORDINALS',
            payload: JSON.stringify(payload),
            sender: author.id
        }])
    }
    const handleClickInside = e => {
        e.preventDefault()
        // Paragraph is lockable if no one is holding the lock
        if(paragraph.lockedBy === undefined || paragraph.lockedBy === null) {
            const payload =  { ...paragraph, lockedBy: author }
            dispatch({ type: 'UPDATE_LOCK', payload })
            sendMessages([{
                type: 'UPDATE_LOCK',
                payload: JSON.stringify(payload),
                sender: author.id
            }]);
        }
    }

    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = e => {
        e.preventDefault()
        if(isLockedByLocalAuthor()) {
            const payload =  { ...paragraph, lockedBy: null }
            dispatch({ type: 'UPDATE_LOCK', payload })
            sendMessages([{
                type: 'UPDATE_LOCK',
                payload: JSON.stringify(payload),
                sender: author.id
            }]);
        }
    }

    const isLockedByLocalAuthor = () => {
        return paragraph.lockedBy !== undefined && paragraph.lockedBy !== null && paragraph.lockedBy.id === author.id;
    }

    const isLocked = () => {
        return !(paragraph.lockedBy === undefined || paragraph.lockedBy === null)
    }

    return (
        <div tabIndex={paragraph.ordinal} className={`paragraph divider-color ${isLockedByLocalAuthor() ? "editing" : "locked"}`} onFocus={handleClickInside} onBlur={handleClickOutside} >
            <div className="paragraphHeader">
                <div>
                    <label>Author: </label>
                    <p>{paragraph.author.name}</p>
                </div>
                <div>
                    <label>Locked By: </label>
                    <p>{isLocked() ? paragraph.lockedBy.name : ''}</p>
                </div>
                <div>
                    <input value={paragraph.ordinal} type="number" disabled={error} readOnly={isLocked() && !isLockedByLocalAuthor()} onChange={handleOrdinalChange}
                           min="1" max={maxOrdinal} />
                    <RemoveParagraphButton id={paragraph.id} isAllowedToRemove={isLockedByLocalAuthor()}/>
                </div>
            </div>
            <div className="paragraphContent">
                <textarea value={paragraph.content} disabled={error} readOnly={isLocked() && !isLockedByLocalAuthor()} onChange={handleContentChange} />
            </div>
        </div>
    );
}

export default Paragraph;
