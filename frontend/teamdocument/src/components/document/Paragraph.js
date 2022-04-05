import React, {useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../../hooks/messages.hook";

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
    return (
        <div>
            <p>Author: {paragraph.author.name}</p>
            <input value={paragraph.ordinal} type="number" onChange={handleOrdinalChange}
                   min="1" max={maxOrdinal}  />
            <br/>
            <textarea value={paragraph.content} onChange={handleContentChange}>
            </textarea>
        </div>
    );
}


export default Paragraph;
