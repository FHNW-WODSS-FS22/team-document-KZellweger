import React from "react";
import {useEffect, useState} from "react";

function useSendMessage(message) {
    // console.log(message)
    // const [messages, setMessages] = useState([message]);
    // useEffect(
    //     () => {
    //         // Update debounced value after delay
    //         const handler = setTimeout(() => {
    //             setMessages([...messages, message]);
    //         }, 500);
    //
    //         // Cancel the timeout if value changes (also on delay change or unmount)
    //         // This is how we prevent debounced value from updating if value is changed ...
    //         // .. within the delay period. Timeout gets cleared and restarted.
    //         return () => {
    //             if(messages.length < 25){
    //                 clearTimeout(handler);
    //             }
    //         };
    //     },
    //     [message] // Only re-call effect if value or delay changes
    // );
    //
    // return messages;
    //
    // // if(!Array.isArray(messages)){
    // //     messages = [messages]
    // // }
    // // const headers = new Headers()
    // // const user = JSON.parse(localStorage.getItem('localUser'))
    // // if(user && user.authdata){
    // //     headers.append('Authorization', 'Basic ' + user.authdata)
    // // }
    // // headers.append('Content-Type', 'application/json')
    // // return fetch(process.env.REACT_APP_BACKEND_BASE + '/message', {
    // //     method: 'POST',
    // //     headers: headers,
    // //     body: JSON.stringify(messages)
    // // }).then(response => {
    // //     // console.log("Response for " + response?.url + " with status: " + response?.status);
    // // }).catch(error => console.error(error))
}

export default useSendMessage;