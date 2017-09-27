/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {Route} from 'react-router-dom'
import {checkAuth} from '../util/auth'

const AuthRoute = ({component: Component, ...rest}) => {
  const {location: from} = rest;

  const loginComponent = checkAuth(from);
  if (loginComponent !== null) {
    return loginComponent;
  }

  return (
    <Route {...rest} render={(props) => (<Component {...props}/>)}/>
  );
};

export default AuthRoute;
