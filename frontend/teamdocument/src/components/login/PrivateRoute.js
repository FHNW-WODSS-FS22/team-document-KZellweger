import React from 'react';
import { Route, Navigate } from 'react-router-dom';

export const PrivateRoute = props => {
    const isAuthenticated = !!localStorage.getItem('localUser')
    if(!isAuthenticated){
        return<Navigate to={"/login"}/>
    }
    return (<Route {...props} />);
}
