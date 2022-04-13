import React, {useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../../hooks/messages.hook";
import RemoveParagraphButton from "./RemoveParagraphButton";

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

    const handleAuthorChange = e => {
        e.preventDefault()
        const payload = { ...paragraph.author, name: e.target.value }
        dispatch({type: 'UPDATE_AUTHOR', payload})

        sendMessage({
            type: 'UPDATE_AUTHOR',
            payload: JSON.stringify(payload),
            sender: author.id
        });
    }

    return (
        <div>
            <label>Author: </label>
            <input value={paragraph.author.name} type="text" onChange={handleAuthorChange}/>
            <br/>
            <input value={paragraph.ordinal} type="number" onChange={handleOrdinalChange}
                   min="1" max={maxOrdinal}  />
            <br/>
            <RemoveParagraphButton id={id}/>
            <br/>
            <textarea value={paragraph.content} onChange={handleContentChange}>
            </textarea>
        </div>
    );
}


export default Paragraph;
