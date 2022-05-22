import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Logout from '../../components/navbar/Logout';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Test Logout Button', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockReset();
  });

  it('Is rendered', () => {
    render(
      <BrowserRouter>
        <Logout />
      </BrowserRouter>,
    );
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it('Redirects after click', () => {
    render(
      <BrowserRouter>
        <Logout />
      </BrowserRouter>,
    );
    const logout = screen.getByText(/logout/i);

    fireEvent.click(logout);

    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);

    expect(mockedUsedNavigate).lastCalledWith('/login');
  });
});
