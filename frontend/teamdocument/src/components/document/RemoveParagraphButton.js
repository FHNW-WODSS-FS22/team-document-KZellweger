import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../../hooks/messages.hook";
import uuid from "../../uuid";

// TODO
/* eslint-disable react/prop-types */
const RemoveParagraphButton = ({id}) => {

    const dispatch = useDispatch();
    const author = useSelector(state => state.author);

    const handleRemoveParagraph = e => {
        e.preventDefault();
        dispatch({ type: 'REMOVE_PARAGRAPH', payload: id })

        sendMessage({
            type: 'REMOVE_PARAGRAPH',
            payload: JSON.stringify(id),
            sender: author.id
        });
    }

    return (
        <button value="Add Paragraph" onClick={handleRemoveParagraph}>
            Remove Paragraph
        </button>
    );
}

export default RemoveParagraphButton;
