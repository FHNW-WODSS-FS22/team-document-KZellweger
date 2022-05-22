import React from 'react';
import './Message.css';
import { useSelector } from 'react-redux';

function Message() {
  const messages = useSelector((state) => state.messages);

  return (
    <div className="wrapper">
      {
          messages.map((m, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={i} className={`message ${m}`}>
              {m}
            </p>
          ))
      }
    </div>
  );
}

export default Message;
