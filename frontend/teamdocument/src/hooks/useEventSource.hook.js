import React, {useEffect, useRef} from 'react';
import {EventSourcePolyfill} from "event-source-polyfill";
import {useDispatch, useSelector} from "react-redux";

const useEventSource = () => {
    const dispatch = useDispatch()
    const author = useSelector(state => state.author);
    const error = useSelector(state => state.error.isPresent);
    const esRef = useRef(null);

    useEffect(() => {
        esRef.current?.close()
        esRef.current = null;
        const user = JSON.parse(localStorage.getItem('localUser'))
        const eventSource = new EventSourcePolyfill(process.env.REACT_APP_BACKEND_BASE + '/document',{
            headers: {
                'Authorization': 'Basic ' + user.authdata,
                'X-ClientId' : author.id
            }
        });
        eventSource.onopen = _ => {
            dispatch({type: 'ERROR', payload: { isPresent: false, display: 'NONE', message: "" }})
        }
        eventSource.onmessage = msg => {
            const cmd = JSON.parse(msg.data)
            if (cmd.sender !== author.id || error) {
                dispatch({type: cmd.type, payload: JSON.parse(cmd.payload)})
            }
        }
        eventSource.onerror = err => {
            if(err.error && err.error.message && err.error.message.includes("No activity within 45000")){
                console.info("Error due to inactivity was ignored.", err)
            } else {
                console.error("An error occured. Attempting to reconnect to server.", err)
                dispatch({type: 'ERROR', payload: { isPresent: true, display: 'DIALOG', message: "Server is not available." }})
            }
        }
        esRef.current = eventSource;
        return () => esRef.current?.close()
    }, [error]);
}

export default useEventSource;
