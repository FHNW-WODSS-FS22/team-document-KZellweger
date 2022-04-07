import React from 'react';
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import ReduxThunk from 'redux-thunk'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import reducer from "./reducers";
import randomUUID from "./uuid";
import {fetchSampleName} from "./nameGenerator";

const localAuthorId = localStorage.getItem('localAuthorId')
const localAuthorName = localStorage.getItem('localAuthorName')

const initialState = (authorId, authorName) => {
    return {
        author: {
            id: authorId,
            name: authorName
        },
        paragraphs: [],
        messages: []
    }
}

if (!localAuthorId) {
    fetchSampleName().then(data => {
            const uuid = randomUUID()
            localStorage.setItem('localAuthorId', uuid)
            localStorage.setItem('localAuthorName', data.name)
            const store = createStore(reducer, initialState(uuid, data.name) , applyMiddleware(ReduxThunk))
            ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('app'))
        }
    )
} else {
    const store = createStore(reducer, initialState(localAuthorId, localAuthorName), applyMiddleware(ReduxThunk))
    ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('app'))
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
