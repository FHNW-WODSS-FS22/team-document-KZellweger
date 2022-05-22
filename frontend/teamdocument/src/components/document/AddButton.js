import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuid from '../../utils/uuid';
import useSendMessagesHook from '../../utils/sendMessagesService';

function AddButton() {
  const error = useSelector((state) => state.error.isPresent);
  const author = useSelector((state) => state.author);
  const ordinals = useSelector((state) => state.paragraphs.map((p) => p.ordinal));
  const dispatch = useDispatch();
  const sendMessages = useSendMessagesHook(dispatch);

  const handleAddParagraph = (e) => {
    e.preventDefault();
    if (e.shiftKey) {
      return sendMessages(null, '/restore');
    }
    const max = Number.isFinite(Math.max(...ordinals)) ? Math.max(...ordinals) : 0;
    const payload = {
      id: uuid(),
      author,
      ordinal: max + 1,
      content: '',
    };
    dispatch({ type: 'ADD_PARAGRAPH', payload });
    return sendMessages([{
      type: 'ADD_PARAGRAPH',
      correlationId: payload.id,
      payload: JSON.stringify(payload),
      sender: author.id,
    }]);
  };

  return (
    <button type="button" disabled={error} className="add" value="Add Paragraph" onClick={handleAddParagraph}>
      Add Paragraph
    </button>
  );
}

export default AddButton;
