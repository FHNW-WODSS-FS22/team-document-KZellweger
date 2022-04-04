import './App.css';
import React, {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Paragraph from "./components/Paragraph";
import Message from "./components/messages/Message";

const App = () => {

  const dispatch = useDispatch()

  const paragraphs = useSelector(state => state.paragraphs);


  const esRef = useRef(null);
  useEffect(() => {
    if (!esRef.current) {
      const eventSource = new EventSource(process.env.REACT_APP_BACKEND_BASE + '/document');
      eventSource.onmessage = msg => {
        const cmd = JSON.parse(msg.data)
        console.log(cmd.type);
        dispatch({ type: cmd.type, payload: cmd.payload })
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
      {
        paragraphs.map(p => { return <Paragraph key={p.id} id={p.id} /> }  )
      }

        <Message />
    </div>
  );
}

export default App;
