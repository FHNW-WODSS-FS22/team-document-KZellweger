import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../../hooks/messages.hook";
import uuid from "../../uuid";

// TODO
/* eslint-disable react/prop-types */
const RemoveParagraphButton = ({id}) => {

    const dispatch = useDispatch();

    const handleRemoveParagraph = e => {
        e.preventDefault();
        const payload =  {
            id: id
        }
        dispatch({ type: 'REMOVE_PARAGRAPH', payload })

        sendMessage({
            type: 'REMOVE_PARAGRAPH',
            payload: JSON.stringify(payload)
        });
    }

    return (
        <button value="Add Paragraph" onClick={handleRemoveParagraph}>
            Remove Paragraph
        </button>
    );
}

export default RemoveParagraphButton;
