import React from 'react';
import {Redirect} from 'react-router-dom';
import AV from 'leancloud-storage';
import {store} from '../../store/persistStore';
import {appStateSelector} from '../../util/appstate'

export function checkAuth(from) { // from is an location object
  const appState = store.getState();

  let appStatus = appStateSelector.selectAppState(appState)
  let isRehydrated = undefined
  if (appStatus) {
    isRehydrated = appStatus.isRehydrated
  }
  if (!isRehydrated) {
    return (
      <Redirect to={{
        pathname: '/loading',
        state: {from}
      }}/>
    )
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

  return undefined
}
