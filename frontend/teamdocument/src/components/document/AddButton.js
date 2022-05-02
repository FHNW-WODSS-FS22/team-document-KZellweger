import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../../hooks/messages.hook";
import uuid from "../../utils/uuid";

const AddButton = () => {

    const author = useSelector(state => state.author);
    const ordinals = useSelector(state => {
        return state.paragraphs.map(p => p.ordinal)
    })
    const dispatch = useDispatch();

    const handleAddParagraph = e => {
        e.preventDefault();
        const max =  Number.isFinite(Math.max(...ordinals)) ? Math.max(...ordinals) : 0
        console.log(max)
        const payload =  {
            id: uuid(),
            author: author,
            ordinal: max + 1,
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
