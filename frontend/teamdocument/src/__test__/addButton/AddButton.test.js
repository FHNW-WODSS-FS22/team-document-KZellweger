// eslint-disable-next-line import/no-extraneous-dependencies
import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { initialState } from '../../index';
import reducer from '../../utils/reducers';
import AddButton from '../../components/document/AddButton';

const unknownAuthor = {
  id: '5bbab532-e546-4cf6-957a-823948baa416',
  name: 'Unknown',
  image: null,
};

describe('Test Add Button', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    global.crypto = require('crypto');
  });

  it('Renders a button', () => {
    // eslint-disable-next-line max-len
    const store = createStore(reducer, initialState(unknownAuthor.id, unknownAuthor.name, unknownAuthor.image), applyMiddleware(ReduxThunk));

    render(
      <Provider store={store}>
        <AddButton />
      </Provider>,
    );

    expect(screen.getByText(/add paragraph/i)).toBeInTheDocument();
  });

  it('Can click add paragraph', () => {
    // eslint-disable-next-line max-len
    const store = createStore(reducer, initialState(unknownAuthor.id, unknownAuthor.name, unknownAuthor.image), applyMiddleware(ReduxThunk));

    render(
      <Provider store={store}>
        <AddButton />
      </Provider>,
    );

    const add = screen.getByText(/add paragraph/i);
    fireEvent.click(add);
  });
});
