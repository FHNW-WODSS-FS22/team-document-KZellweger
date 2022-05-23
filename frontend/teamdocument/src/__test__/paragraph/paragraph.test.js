import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducer from '../../utils/reducers';
import { initialState } from '../../index';
import Paragraph from '../../components/document/paragraph/Paragraph';

const author = () => ({
  id: '5bbab532-e546-4cf6-957a-823948baa416',
  name: 'Unknown',
  image: null,
});

const paragraph = () => ({
  id: '5bbab532-e546-4cf6-957a-823948baa417',
  ordinal: 1,
  content: '',
  author: author(),
});

const mockStore = () => {
  const unknown = author();
  // eslint-disable-next-line max-len
  const s = createStore(reducer, initialState(unknown.id, unknown.name, unknown.image), applyMiddleware(ReduxThunk));
  return s;
};

let store;
describe('Test paragraph', () => {
  beforeEach(() => {
    store = mockStore();
  });

  it('Is rendered withour error', () => {
    const p = paragraph();
    store.dispatch({ type: 'ADD_PARAGRAPH', p });
    console.log(store.getState());
    render(
      <Provider store={store}>
        <Paragraph id={p.id} />
      </Provider>,
    );
    expect(screen.getByText(/author/i)).toBeInTheDocument();
    expect(screen.getByText(/locked-by/i)).toBeInTheDocument();
  });
});
