import './Paragraph.css';
import React, {useRef} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../../../hooks/messages.hook";
import RemoveParagraphButton from "../RemoveParagraphButton";

// TODO
/* eslint-disable react/prop-types */
const Paragraph = ({id}) => {

    const error = useSelector(state => state.error.isPresent);
    const author = useSelector(state => state.author);
    const paragraph = useSelector(state => state.paragraphs.find(p => id === p.id));
    const paragraphs = useSelector(state => state.paragraphs);
    const dispatch = useDispatch()
    const maxOrdinal = useSelector(state => {
        const ordinals =  state.paragraphs.map(p => p.ordinal)
        return Math.max(...ordinals)
    })

    const handleContentChange = e => {
        e.preventDefault()
        const payload =  { ...paragraph, content: e.target.value }
        dispatch({ type: 'UPDATE_PARAGRAPH', payload })

        sendMessage({
            type: 'UPDATE_PARAGRAPH',
            payload: JSON.stringify(payload),
            sender: author.id
        });
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
        sendMessage({
            type: 'UPDATE_PARAGRAPH_ORDINALS',
            payload: JSON.stringify(payload),
            sender: author.id
        });
    }
    const handleClickInside = e => {
        e.preventDefault()
        // Paragraph is lockable if no one is holding the lock
        if(paragraph.lockedBy === undefined || paragraph.lockedBy === null) {
            const payload =  { ...paragraph, lockedBy: author.id }
            dispatch({ type: 'UPDATE_LOCK', payload })
            console.log("locking")

            sendMessage({
                type: 'UPDATE_LOCK',
                payload: JSON.stringify(payload),
                sender: author.id
            });
        }
    }

    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = e => {
        if(paragraph.lockedBy === author.id) {
            const payload =  { ...paragraph, lockedBy: null }
            dispatch({ type: 'UPDATE_LOCK', payload })

            sendMessage({
                type: 'UPDATE_LOCK',
                payload: JSON.stringify(payload),
                sender: author.id
            });
        }
    }

    return (
        <div tabIndex={paragraph.ordinal} className={`paragraph divider-color ${paragraph.lockedBy === author.id ? "editing" : "locked"}`} onFocus={handleClickInside} onBlur={handleClickOutside} >
            <div className="paragraphHeader">
                <div>
                    <label>Author: </label>
                    <p>{paragraph.author.name}</p>
                </div>
                <div>
                    <label>Locked By: </label>
                    <p>{paragraph.lockedBy}</p>
                </div>
                <div>
                    <input value={paragraph.ordinal} type="number" disabled={error} readOnly={paragraph.lockedBy !== author.id} onChange={handleOrdinalChange}
                           min="1" max={maxOrdinal} />
                    <RemoveParagraphButton id={paragraph.id} isAllowedToRemove={paragraph.lockedBy === author.id}/>
                </div>
            </div>
            <div className="paragraphContent">
                <textarea value={paragraph.content} disabled={error} readOnly={paragraph.lockedBy !== author.id} onChange={handleContentChange} />
            </div>
        </div>
    );
}

export default Paragraph;
