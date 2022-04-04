import React, {useEffect, useState, useRef} from 'react'
import {useSelector} from "react-redux";

const Paragraph = () => {

    const text = useSelector(state => state.text);


    return (
        <div>
            <p>Author goes here.</p>
            <br/>
            <input type="number" min="0"  />
            <br/>
            <textarea value={text}>
            </textarea>
        </div>
    );
}

export default Paragraph;
