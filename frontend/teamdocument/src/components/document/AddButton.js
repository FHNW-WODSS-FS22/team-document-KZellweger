import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../../hooks/messages.hook";
import uuid from "../../uuid";

const AddButton = () => {

    const author = useSelector(state => state.author);
    const dispatch = useDispatch();

    const handleAddParagraph = e => {
        e.preventDefault();

        const payload =  {
            id: uuid(),
            author: author,
            ordinal: 0,
            content: ''
        }
        dispatch({ type: 'ADD_PARAGRAPH', payload })

        sendMessage({
            type: 'ADD_PARAGRAPH',
            payload: JSON.stringify(payload),
            sender: author.id
        });
    }

    return (
        <button value="Add Paragraph" onClick={handleAddParagraph}>
            Add Paragraph
        </button>
    );
}

export default AddButton;
