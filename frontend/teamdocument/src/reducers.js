import _ from 'lodash'

const REDUCERS = {
    'INITIAL': (state, action) => ( { ...state, text: action.payload })
}

const reducer = (state, action) => _.get(REDUCERS, action.type, _.identity)(state, action)
export default reducer
