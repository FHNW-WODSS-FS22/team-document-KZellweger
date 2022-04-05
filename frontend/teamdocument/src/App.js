import './App.css';
import React, {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Paragraph from "./components/Paragraph";
import Message from "./components/messages/Message";
import {sendMessage} from "./hooks/messages.hook";
import randomUUID from "./uuid";

const App = () => {

  const dispatch = useDispatch()
  const paragraphs = useSelector(state => state.paragraphs);
  const thisAuthor = useSelector(state => state.author)
  const esRef = useRef(null);
  useEffect(() => {
    if (!esRef.current) {
      const eventSource = new EventSource(process.env.REACT_APP_BACKEND_BASE + '/document');
      eventSource.onmessage = msg => {
        const cmd = JSON.parse(msg.data)
        const payload = JSON.parse(cmd.payload);
        dispatch({ type: cmd.type, payload: payload })
      }
      eventSource.onerror = err => {
        console.log(err)
        dispatch({ type: 'ERROR', value: err })
      }
      esRef.current = eventSource;
      return () => esRef.current.close()
    }
  }, []);

  const addParagraph = () => {
    sendMessage({
      type: 'ADD_PARAGRAPH',
      payload: JSON.stringify({
        id: randomUUID(),
        ordinal: -1,
        content: '',
        author: thisAuthor
      }),
      sender: '89f3a230-8996-4d60-bc5a-a384cb9f824e'
    });
  }

  return (
    <div className="App" id="app">
      <button onClick={addParagraph}>+</button>
      {
        paragraphs.map(p => { return <Paragraph key={p} id={p.id} /> }  )
      }

      <Message />
    </div>
  );
}

export default App;
