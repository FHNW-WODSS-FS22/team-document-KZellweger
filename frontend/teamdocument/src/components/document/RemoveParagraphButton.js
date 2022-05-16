import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../../hooks/messages.hook";

// TODO
/* eslint-disable react/prop-types */
const RemoveParagraphButton = ({id, isAllowedToRemove}) => {

    const dispatch = useDispatch();
    const author = useSelector(state => state.author);

    const handleRemoveParagraph = e => {
        e.preventDefault();
        if (isAllowedToRemove) {
            dispatch({ type: 'REMOVE_PARAGRAPH', payload: id })

            sendMessage({
                type: 'REMOVE_PARAGRAPH',
                payload: JSON.stringify(id),
                sender: author.id
            });
        }
    }

    return (
        <button value="Remove Paragraph" className={`remove danger ${isAllowedToRemove ? "" : "locked"}`} onClick={handleRemoveParagraph} tabIndex={-1} >
            Remove
        </button>
    );
}

export default RemoveParagraphButton;
