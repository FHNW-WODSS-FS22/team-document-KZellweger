import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import uuid from "../../utils/uuid";
import useSendMessagesHook from "../../utils/sendMessagesService";

const AddButton = () => {

    const error = useSelector(state => state.error.isPresent);
    const author = useSelector(state => state.author);
    const ordinals = useSelector(state => {
        return state.paragraphs.map(p => p.ordinal)
    })
    const dispatch = useDispatch();
    const sendMessages = useSendMessagesHook(dispatch);

    const handleAddParagraph = e => {

        if (e.shiftKey) {

            console.log("SHIFTGESICHT")

            const headers = new Headers()
            const user = JSON.parse(localStorage.getItem('localUser'))
            if (user && user.authdata) {
                headers.append('Authorization', 'Basic ' + user.authdata)
            }

            return fetch(process.env.REACT_APP_BACKEND_BASE + '/message/restore', {
                method: 'POST',
                headers: headers,
            }).then(response => {
                if (response.status < 200 || response.status > 299) {
                    console.log("Dispatchy")
                    dispatch({type: 'ERROR', payload: { isPresent: true, message: "An error has occurred. \n Some of your changes may not have been saved." }})
                }
            })



        }

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

        sendMessages([{
            type: 'ADD_PARAGRAPH',
            payload: JSON.stringify(payload),
            sender: author.id
        }])
    }

    return (
        <button disabled={error} value="Add Paragraph" onClick={handleAddParagraph}>
            Add Paragraph
        </button>
    );
}

export default AddButton;
