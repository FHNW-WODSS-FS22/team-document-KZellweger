import './Paragraph.css';
import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../../../hooks/messages.hook";

// TODO
/* eslint-disable react/prop-types */
const Paragraph = ({id}) => {

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

    return (
        <div className="paragraph divider-color">
            <div className="paragraphHeader">
                <div>
                    <label>Author: </label>
                    <p>{paragraph.author.name}</p>
                </div>
                <div>
                    <input value={paragraph.ordinal} type="number" onChange={handleOrdinalChange}
                           min="1" max={maxOrdinal}  />
                </div>
            </div>
            <div className="paragraphContent">
                <textarea value={paragraph.content} onChange={handleContentChange} />
            </div>
        </div>
    );
}

export default Paragraph;
