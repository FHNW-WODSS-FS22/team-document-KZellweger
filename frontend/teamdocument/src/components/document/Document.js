import './Document.css';
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useRef} from "react";
import AddButton from "./AddButton";
import Paragraph from "./paragraph/Paragraph";
import Message from "../message/Message";
import User from "../user/User";
import {EventSourcePolyfill} from 'event-source-polyfill';

const Document = () => {
    const dispatch = useDispatch()
    const paragraphs = useSelector(state => state.paragraphs);
    const author = useSelector(state => state.author);
    const esRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('localUser'))
        if (!esRef.current) {
            const eventSource = new EventSourcePolyfill(process.env.REACT_APP_BACKEND_BASE + '/document',{
                headers: {
                    'Authorization': 'Basic ' + user.authdata
                }
            });
            eventSource.onmessage = msg => {
                const cmd = JSON.parse(msg.data)
                if (cmd.sender !== author.id) {
                    dispatch({type: cmd.type, payload: JSON.parse(cmd.payload)})
                }
                dispatch({type: 'ERROR', payload: { isPresent: false, message: "" }})
            }
            eventSource.onerror = err => {
                console.log(err)
                if(err.error && err.error.message && err.error.message.includes("No activity within 45000")){
                    console.log("Ignore this one since it is not relevant", err)
                } else {
                    dispatch({type: 'ERROR', payload: { isPresent: true, message: "Server is not available." }})
                }
            }
            esRef.current = eventSource;
            return () => esRef.current.close()
        }
    }, []);

    return (
        <div className="document" id="document">
            <div>
                <User />
            </div>
            <div>
                <AddButton/>
            </div>
            <div className="documentContent">
                <div className="paragraphs">
                    <h1>Paragraphs</h1>
                    {
                        paragraphs
                            .sort((p1, p2) => p1.ordinal - p2.ordinal)
                            .map(p => <Paragraph key={p.id} id={p.id}/>)
                    }
                </div>
                <div className="messages">
                    <h1>Messages</h1>
                    <Message/>
                </div>
            </div>
        </div>
    );
}

export default Document
