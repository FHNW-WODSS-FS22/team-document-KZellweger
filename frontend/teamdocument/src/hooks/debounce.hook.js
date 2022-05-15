import React, {useEffect, useState} from 'react';
let counter = 0;
function useDebounceMessages(message, delay, maxElements) {
    // State and setters for debounced value
    const [messages, setMessages] = useState();
    useEffect(
        () => {
            // Update debounced value after delay
            if(message !== null){
                const handler = setTimeout(() => {
                    console.log("Set message")
                    setMessages(message);
                }, delay);
                // Cancel the timeout if value changes (also on delay change or unmount)
                // This is how we prevent debounced value from updating if value is changed ...
                // .. within the delay period. Timeout gets cleared and restarted.
                return () => {
                    if(counter < maxElements){
                        console.log("clear timeout", counter)
                        counter = counter +1
                        clearTimeout(handler);
                    } else {
                        console.log("reset counter after ", counter)
                        setTimeout(() => {
                            counter = 0
                        },10)
                    }
                };
            }
        },
        [message, delay] // Only re-call effect if value or delay changes
    );
    return messages;
}

export default useDebounceMessages;