import './User.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import blank from './blank_user.png';
import useDebounceMessages from '../../hooks/useDebounceMessages.hook';
import useSendMessagesHook from '../../utils/sendMessagesService';

function User() {
  const dispatch = useDispatch();
  const sendMessages = useSendMessagesHook(dispatch);
  const author = useSelector((state) => state.author);
  const error = useSelector((state) => state.error.isPresent);
  const otherAuthors = useSelector((state) => state.otherAuthors);

  const [message, setMessage] = useState([]);
  const accumulatedMessages = useDebounceMessages(message, 100);

  useEffect(() => {
    // eslint-disable-next-line valid-typeof, max-len
    if (typeof accumulatedMessages !== undefined && Array.isArray(accumulatedMessages) && accumulatedMessages.length > 0) {
      sendMessages(accumulatedMessages);
      setMessage([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accumulatedMessages]);

  const handleAuthorChange = (e) => {
    e.preventDefault();
    const json = {
      id: author.id,
      name: author.name,
      image: author.image,
    };
    const payload = { ...json, name: e.target.value };
    dispatch({ type: 'UPDATE_AUTHOR', payload });
    const newMessage = {
      type: 'UPDATE_AUTHOR',
      payload: JSON.stringify(payload),
      sender: author.id,
    };
    setMessage([...message, newMessage]);
  };

  const imageIsNullOrUndefined = (image) => (image === null || image === undefined);

  return (
    <div className="userContainer">
      <div className="user">
        <div className="circular">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
          <img src={imageIsNullOrUndefined(author.image) ? blank : author.image} className="user-icon" alt="Profile image" />
        </div>
        <div className="name">
          <input
            disabled={error}
            type="text"
            value={author.name}
            className="username-primary divider-color"
            onChange={handleAuthorChange}
          />
          <p><em className="username-secondary secondary-text-color">{author.id}</em></p>
        </div>
      </div>
      <div className="otherUser">
        {
            otherAuthors
              .filter((a) => a.id !== author.id)
              .map((a) => (
                <div className="circular" key={a.id} id={a.id}>
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  <img src={imageIsNullOrUndefined(a.image) ? blank : a.image} alt="Profile image" title={a.name ? a.name : 'UNKNOWN'} />
                </div>
              ))
        }
      </div>
    </div>
  );
}

export default User;
