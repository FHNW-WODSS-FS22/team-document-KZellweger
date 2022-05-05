import './Paragraph.css';
import React, {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../../../hooks/messages.hook";
import RemoveParagraphButton from "../RemoveParagraphButton";

// TODO
/* eslint-disable react/prop-types */
const Paragraph = ({id}) => {

    const author = useSelector(state => state.author);
    const paragraph = useSelector(state => state.paragraphs.find(p => id === p.id));
    const dispatch = useDispatch()
    const maxOrdinal = useSelector(state => {
        const ordinals =  state.paragraphs.map(p => p.ordinal)
        return Math.max(...ordinals)
    })
    const ref = useRef()

    // According to best practice https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return function cleanup() {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

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
        const payload =  { ...paragraph, ordinal: e.target.valueAsNumber }
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
        if(paragraph.lockedBy === undefined) {
            const payload =  { ...paragraph, lockedBy: author.id }
            dispatch({ type: 'UPDATE_LOCK', payload })

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
        /**if (ref.current && !ref.current.contains(e.target) && paragraph.lockedBy === author.lockedBy) {
            const payload =  { ...paragraph, lockedBy: null }
            dispatch({ type: 'UPDATE_LOCK', payload })

            sendMessage({
                type: 'UPDATE_LOCK',
                payload: JSON.stringify(payload),
                sender: author.id
            });
        }**/
    }

    return (
        <div className={`paragraph divider-color ${paragraph.lockedBy === author.id ? "locked" : ""}`} onClick={handleClickInside} ref={ref} >
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
                    <input value={paragraph.ordinal} type="number" onChange={handleOrdinalChange}
                           min="1" max={maxOrdinal} readOnly={!paragraph.lockedBy === author.id}/>
                    <RemoveParagraphButton id={paragraph.id} />
                </div>
            </div>
            <div className="paragraphContent">
                <textarea value={paragraph.content} onChange={handleContentChange} />
            </div>
        </div>
    );
}


export default Paragraph;
