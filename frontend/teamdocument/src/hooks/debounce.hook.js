import React, {useEffect, useState} from 'react';

const useDebounce = (delay, inputValue, defaultValue) => {
    const [value, setValue] = useState(defaultValue);
    console.log(inputValue)
    useEffect(
        () => {
            const handler = setTimeout(() => {
                setValue(inputValue);
            }, delay);
            return () => { // Cleanup on input change
                clearTimeout(handler);
            };
        },
        [inputValue] // Execute on every input change
    );

    return value;
};

export default useDebounce;