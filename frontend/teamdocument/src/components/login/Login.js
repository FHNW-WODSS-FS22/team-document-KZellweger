import React, { useState } from 'react';
import './Login.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../../utils/loginService';

function Login() {
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    loginService.login(user, pwd).then(
      // eslint-disable-next-line no-shadow, no-unused-vars
      (user) => {
        dispatch({ type: 'LOGIN', payload: true });
        navigate('/');
      },
      (error) => alert(error),
    );
  };

  return (
    <div className="login-div">
      <h2>Login</h2>
      <form name="form" onSubmit={(event) => handleSubmit(event)} className="login-form">
        <div>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="username form-control"
            name="username"
            value={user}
            onChange={(event) => setUser(event.target.value)}
          />
        </div>
        <div>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="password form-control"
            name="password"
            value={pwd}
            onChange={(event) => setPwd(event.target.value)}
          />
        </div>
        <div>
          <button type="submit" className="login btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
