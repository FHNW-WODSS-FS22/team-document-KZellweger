import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useRef} from "react";
import AddButton from "./document/AddButton";
import Paragraph from "./document/Paragraph";
import Message from "./messages/Message";

const Document = () => {
    const dispatch = useDispatch()
    const paragraphs = useSelector(state => state.paragraphs);
    const author = useSelector(state => state.author);

    const esRef = useRef(null);

    useEffect(() => {
        if (!esRef.current) {
            const eventSource = new EventSource(process.env.REACT_APP_BACKEND_BASE + '/document', {withCredentials:true});
            eventSource.onmessage = msg => {
                const cmd = JSON.parse(msg.data)
                if (cmd.sender !== author.id) {
                    dispatch({type: cmd.type, payload: JSON.parse(cmd.payload)})
                }
            }
            eventSource.onerror = err => {
                console.log(err)
                dispatch({type: 'ERROR', value: err})
            }
            esRef.current = eventSource;
            return () => esRef.current.close()
        }
    }, []);


    return (
        <div className="Document" id="Document">
            <p>Author : {author.name}</p>
            <p>AuthorID : {author.id}</p>
            <AddButton/>
            {
                paragraphs.sort((p1, p2) => p1.ordinal - p2.ordinal)
                    .map(p => {
                        return <Paragraph key={p.id} id={p.id}/>
                    })
            }
            <Message/>
        </div>
    );
}


export default Document