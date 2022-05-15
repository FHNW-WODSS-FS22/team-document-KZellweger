import {render} from "@testing-library/react";
import {screen} from '@testing-library/react';
import User from "../../components/user/User";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import reducer from "../../utils/reducers";
import ReduxThunk from "redux-thunk";
import {initialState} from "../../index";

const unknownAuthor = {
    "id": "5bbab532-e546-4cf6-957a-823948baa416",
    "name": "Unknown",
    "image": null
}

const R5D4 = {
    "id": "035faf28-7ec8-45b6-a5f8-23a3039e56c3",
    "name": "R5-D4",
    "image": "https://vignette.wikia.nocookie.net/starwars/images/c/cb/R5-D4_Sideshow.png"
}

describe('Test User panel', () => {
    it('it is rendered without image (null)', () => {
        const store = createStore(reducer, initialState(unknownAuthor.id, unknownAuthor.name, unknownAuthor.image) , applyMiddleware(ReduxThunk))

        render(
            <Provider store={store}>
                <User />
            </Provider>
        )
        expect(screen.getByText(unknownAuthor.id)).toBeInTheDocument();
        expect(screen.getByDisplayValue(unknownAuthor.name)).toBeInTheDocument();
        const image = screen.getByAltText(/Profile Image/i);
        expect(image.src).toContain("blank_user.png");
    })

    it('it is rendered without image (undefined)', () => {
        const store = createStore(reducer, initialState(unknownAuthor.id, unknownAuthor.name, undefined) , applyMiddleware(ReduxThunk))

        render(
            <Provider store={store}>
                <User />
            </Provider>
        )

        expect(screen.getByText(unknownAuthor.id)).toBeInTheDocument();
        expect(screen.getByDisplayValue(unknownAuthor.name)).toBeInTheDocument();
        const image = screen.getByAltText(/Profile Image/i);
        expect(image.src).toContain("blank_user.png");
    })

    it('it is rendered with image', () => {
        const store = createStore(reducer, initialState(R5D4.id, R5D4.name, R5D4.image) , applyMiddleware(ReduxThunk))

        render(
            <Provider store={store}>
                <User />
            </Provider>
        )
        expect(screen.getByText(R5D4.id)).toBeInTheDocument();
        expect(screen.getByDisplayValue(R5D4.name)).toBeInTheDocument();
        const image = screen.getByAltText(/Profile Image/i);
        expect(image.src).toContain(R5D4.image);
    })
})