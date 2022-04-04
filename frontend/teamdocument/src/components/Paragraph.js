import React, {useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../hooks/messages.hook";

// TODO
/* eslint-disable react/prop-types */
const Paragraph = ({id}) => {

    const paragraph = useSelector(state => {
        console.log(state);

        return state.paragraphs.find(p => id === p.id);
    });
    const dispatch = useDispatch()

    const handleChange = e => {
        e.preventDefault()


        const payload =  { ...paragraph, content: e.target.value }
        dispatch({ type: 'UPDATE_PARAGRAPH', payload })

        sendMessage({
            type: 'UPDATE_PARAGRAPH',
            payload: JSON.stringify(payload),
            sender: '89f3a230-8996-4d60-bc5a-a384cb9f824e'
        });
    }

    return (
        <div>
            <p>Author goes here.</p>
            <br/>
            <input type="number" min="0"  />
            <br/>
            <textarea value={paragraph.content} onChange={handleChange}>
            </textarea>
        </div>
    );
}


export default Paragraph;
