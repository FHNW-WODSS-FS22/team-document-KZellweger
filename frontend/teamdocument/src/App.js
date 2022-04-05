import './App.css';
import React, {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Paragraph from "./components/document/Paragraph";
import Message from "./components/messages/Message";
import AddButton from "./components/document/AddButton";

const App = () => {

  const dispatch = useDispatch()
  const paragraphs = useSelector(state => state.paragraphs);
  const author = useSelector(state => state.author);

  const esRef = useRef(null);
  useEffect(() => {
    if (!esRef.current) {
      const eventSource = new EventSource(process.env.REACT_APP_BACKEND_BASE + '/document');
      eventSource.onmessage = msg => {
        const cmd = JSON.parse(msg.data)
        if (cmd.sender !== author.id) {
          dispatch({ type: cmd.type, payload: JSON.parse(cmd.payload) })
        }
      }
      eventSource.onerror = err => {
        console.log(err)
        dispatch({ type: 'ERROR', value: err })
      }
      esRef.current = eventSource;
      return () => esRef.current.close()
    }
  }, []);

  return (
    <div className="App" id="app">
      <AddButton/>
      {
        paragraphs.sort((p1, p2) => p1.ordinal - p2.ordinal)
          .map(p => { return <Paragraph key={p.id} id={p.id} /> } )
      }
      <Message />
    </div>
  );
}

export default App;
