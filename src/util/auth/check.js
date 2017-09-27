import React from 'react';
import {Redirect} from 'react-router-dom';
import AV from 'leancloud-storage';
import {authAction, authSelector} from './redux';
import {store} from '../../store/persistStore';
import {Loading} from '../../route/Loading/';

export function checkAuth(from) { // from is an location object
  const appState = store.getState();

  // TODO: check rehydration

  const activeUserId = authSelector.selectActiveUserId(appState);
  if (activeUserId !== null) { // already authenticated
    return null;
  }

  const curUser = AV.User.current();
  if (curUser === null) { // the first time access
    return (
      <Redirect to={{
        pathname: '/login',
        state: {from}
      }}/>
    );
  }

  // re-auth with the server
  console.log("---> curUser: ", curUser);

  const token = curUser.getSessionToken();
  store.dispatch(authAction.autoLogin({token}));

  // const token = curUser.getSessionToken();
  //
  // const payload = {
  //   userInfo: {
  //     userId: curUser.id,
  //     ...curUser.attributes,
  //     createAt: curUser.createdAt.valueOf(),
  //     updateAt: curUser.updatedAt.valueOf(),
  //   },
  //   token
  // };
  //
  // store.dispatch(authAction.loginSuccess(payload));

  return <Loading from={from}/>;
}