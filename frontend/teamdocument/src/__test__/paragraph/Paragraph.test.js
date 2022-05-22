import {applyMiddleware, createStore} from "redux";
import reducer from "../../utils/reducers";
import {initialState} from "../../index";
import ReduxThunk from "redux-thunk";
import {render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import Paragraph from "../../components/document/paragraph/Paragraph";

const unknownAuthor = {
    "id": "5bbab532-e546-4cf6-957a-823948baa416",
    "name": "Unknown",
    "image": null
}

const paragraph = {
    id: "a40b225b-50a4-4c65-af2e-e965fa6a1c1e",
    ordinal: 1,
    content: "",
    author: unknownAuthor,
    lockedBy: null
}

describe('Test Paragraph', () => {
    let store = undefined;

    beforeEach(() => {
        store = createStore(reducer, initialState(unknownAuthor.id, unknownAuthor.name, unknownAuthor.image) , applyMiddleware(ReduxThunk))
        store.dispatch({ type: 'ADD_PARAGRAPH', paragraph });
    })

    it('Renders a paragraph', () => {
        render(
            <Provider store={store}>
                <Paragraph id={paragraph.id}/>
            </Provider>
        )
    })
})