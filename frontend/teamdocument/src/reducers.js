import _ from 'lodash'

const REDUCERS = {
    'INITIAL': (state, action) => ( { ...state, paragraphs: _.concat(state.paragraphs, action.payload) }),

    'UPDATE_PARAGRAPH': (state, action) => ({
        ...state,
        paragraphs: _.map(state.paragraphs, p => p.id === action.payload.id ? action.payload : p )
    }),

    'ERROR': (state, action) => ( { ...state })
}

const reducer = (state, action) => _.get(REDUCERS, action.type, _.identity)(state, action)
export default reducer
