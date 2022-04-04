import React, {useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../hooks/messages.hook";

const Paragraph = () => {

    const text = useSelector(state => state.text);
    const dispatch = useDispatch()

    const handleChange = e => {
        e.preventDefault()
        dispatch({ type: 'UPDATE_PARAGRAPH', payload: e.target.value })
        sendMessage({
            type: 'UPDATE_PARAGRAPH',
            payload: e.target.value,
            sender: '89f3a230-8996-4d60-bc5a-a384cb9f824e'
        });
    }

    return (
        <div>
            <p>Author goes here.</p>
            <br/>
            <input type="number" min="0"  />
            <br/>
            <textarea value={text} onChange={handleChange}>
            </textarea>
        </div>
    );
}

export default Paragraph;
