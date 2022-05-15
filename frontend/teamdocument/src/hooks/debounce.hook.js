import React, {useEffect, useState} from 'react';

function useDebounceMessages(message, delay, maxElements) {
    // State and setters for debounced value
    const [messages, setMessages] = useState();
    useEffect(
        () => {
            // Update debounced value after delay
            if(message !== null){
                const handler = setTimeout(() => {
                    setMessages( message);
                }, delay);
                // Cancel the timeout if value changes (also on delay change or unmount)
                // This is how we prevent debounced value from updating if value is changed ...
                // .. within the delay period. Timeout gets cleared and restarted.
                return () => {
                        clearTimeout(handler);
                };
            }
        },
        [message, delay] // Only re-call effect if value or delay changes
    );
    return messages;
}

export default useDebounceMessages;