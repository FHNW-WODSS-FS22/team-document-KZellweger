import _ from 'lodash'

const REDUCERS = {
    'LOGIN' : (state, action) => ({
       ...state,
       isAuthenticated: action.payload
    }),

    'INITIAL': (state, action) => ( {
        ...state,
        paragraphs: action.payload,
        otherAuthors: _.map(state.otherAuthors, a => a.id === action.payload.author.id ? action.payload.author : a),
        messages: _.concat(state.messages, action.type)
    }),

    'ADD_PARAGRAPH': (state, action) => ({
        ...state,
        paragraphs: _.concat(state.paragraphs, action.payload),
        otherAuthors: _.map(state.otherAuthors, a => a.id === action.payload.author.id ? action.payload.author : a),
        messages: _.concat(state.messages, action.type)
    }),

    'REMOVE_PARAGRAPH': (state, action) => ({
        ...state,
        paragraphs: _.remove(state.paragraphs, p => p.id !== action.payload),
        messages: _.concat(state.messages, action.type)
    }),

    'UPDATE_PARAGRAPH': (state, action) => ({
        ...state,
        paragraphs: _.map(state.paragraphs, p => p.id === action.payload.id ? action.payload : p),
        messages: _.concat(state.messages, action.type)
    }),

    'UPDATE_PARAGRAPH_ORDINALS': (state, action) => ({
        ...state,
        paragraphs: updateOrder(state.paragraphs, action.payload),
        messages: _.concat(state.messages, action.type)
    }),

    'UPDATE_AUTHOR': (state, action) => ({
        ...state,
        author: updateLocalAuthor(state.author, action.payload),
        paragraphs: updateParagraphAuthors(state.paragraphs, action.payload),
        messages: _.concat(state.messages, action.type)
    }),

    'UPDATE_LOCK': (state, action) => ({
        ...state,
        paragraphs: _.map(state.paragraphs, p => p.id === action.payload.id ? action.payload : p ),
        otherAuthors: _.map(state.otherAuthors, a => a.id === action.payload.author.id ? action.payload.author : a),
        messages: _.concat(state.messages, action.type)
    }),

    'ADD_CLIENTS': (state, action) => ({
        ...state,
        otherAuthors: addOtherAuthors(state.otherAuthors, action.payload),
        messages: _.concat(state.messages, action.type)
    }),

    'REMOVE_CLIENT': (state, action) => ({
        ...state,
        messages: _.concat(state.messages, action.type)
    }),


    'ERROR': (state, action) => ({...state, error: action.payload})
}

const updateOrder = (prevStateParagraphs, changedStateParagraphs) => {
    changedStateParagraphs.forEach(pChanged => {
        const prev = prevStateParagraphs.find(pPrev => pPrev.id === pChanged.id)
        if (prev) prev.ordinal = pChanged.ordinal
    })
    return prevStateParagraphs.map(p => changedStateParagraphs.find(np => np.id === p.id) || p)
}

const updateLocalAuthor = (author, changedAuthor) => {
    if (author.id === changedAuthor.id) {
        localStorage.setItem('localAuthorName', changedAuthor.name)
        return changedAuthor
    }
    return author
}

const updateParagraphAuthors = (paragraphs, changedAuthor) => {
    const updatedParagraphs = paragraphs.filter(p => {
        return p.author.id === changedAuthor.id
    }).map(p => {
        return {...p, 'author': changedAuthor}
    })
    return paragraphs.map(p => updatedParagraphs.find(up => up.id === p.id) || p)
}

const addOtherAuthors = (otherAuthors, newAuthorIds) => {
    console.log(otherAuthors)
    const newAuthors = newAuthorIds
        .filter(id => !_.find(otherAuthors, ['id', id]))
        .map( id => ({
            'id': id,
            'name': undefined,
            'image': undefined
        }))
    return _.concat(otherAuthors,newAuthors)
}

const reducer = (state, action) => _.get(REDUCERS, action.type, _.identity)(state, action)
export default reducer
