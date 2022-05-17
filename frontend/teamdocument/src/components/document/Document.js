import './Document.css';
import {useSelector} from "react-redux";
import React from "react";
import AddButton from "./AddButton";
import Paragraph from "./paragraph/Paragraph";
import Message from "../message/Message";
import User from "../user/User";
import useEventSource from "../../hooks/useEventSource.hook";

const Document = () => {
    const paragraphs = useSelector(state => state.paragraphs);

    useEventSource();

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
