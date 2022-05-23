import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../../utils/loginService';

function Logout() {
  const navigate = useNavigate();

  const logout = () => {
    loginService.logout();
    navigate('/login');
  };

  return (
    <button type="button" className="logout" onClick={logout}>Logout</button>
  );
}

export default Logout;
