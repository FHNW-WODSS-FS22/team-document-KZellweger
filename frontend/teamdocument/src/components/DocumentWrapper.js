import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from './navbar/Navbar';
import Document from './document/Document';

function DocumentWrapper() {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  return (
    <div>
      {isAuthenticated
        ? (
          <div>
            <Navbar />
            <Document />
          </div>
        )
        : <Navigate to="/login" />}
    </div>
  );
}

export default DocumentWrapper;
