import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useMessage} from "../../hooks/messages.hook";

// TODO
/* eslint-disable react/prop-types */
const RemoveParagraphButton = ({id, isAllowedToRemove}) => {

    const sendMessage = useMessage;
    const dispatch = useDispatch();
    const author = useSelector(state => state.author);

    const handleRemoveParagraph = e => {
        e.preventDefault();
        if (isAllowedToRemove) {
            console.log(id);
            dispatch({ type: 'REMOVE_PARAGRAPH', payload: id })

            sendMessage({
                type: 'REMOVE_PARAGRAPH',
                payload: JSON.stringify(id),
                sender: author.id
            });
        }
    }

    return (
        <button value="Remove Paragraph" className={`danger ${isAllowedToRemove ? "" : "locked"}`} onClick={handleRemoveParagraph} tabIndex={-1} >
            Remove
        </button>
    );
}

export default RemoveParagraphButton;
