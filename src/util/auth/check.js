import React from 'react';
import {Redirect} from 'react-router-dom';
import AV from 'leancloud-storage';
import {action as authAction, selector as authSelector} from './redux';
import {store} from '../../store/persistStore';
import {Loading} from '../../route/Loading/';

export function checkAuth(from) { // from is an location object
  const appState = store.getState();

  // TODO: check rehydration

  const activeUserId = authSelector.selectActiveUserId(appState);
  if (activeUserId !== undefined) { // already authenticated
    return undefined;
  }

  const curUser = AV.User.current();
  if (curUser == undefined) { // the first time access, undefined or null
    return (
      <Redirect to={{
        pathname: '/login',
        state: {from}
      }}/>
    );
  }

  // re-auth with the server
  const token = curUser.getSessionToken();
  store.dispatch(authAction.loginWithToken({token}));

  return <Loading from={from}/>;
}
