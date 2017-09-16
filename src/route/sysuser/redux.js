import {createAction} from 'redux-actions';
import {call, put, takeLatest} from 'redux-saga/effects';
import {Record} from 'immutable';
import {listSysUsers} from './api';

// --- State

const SysUserState = Record({
  users: null,
}, "SysUserState");

// --- Selector

export function selectSysUsers(appState) {
  const sysuser = appState.sysuser;
  return sysuser.users;
}

// --- Action

const REQUEST_LIST_SYS_USERS = 'SysUser/REQUEST_LIST_SYS_USERS';
const FINISH_LIST_SYS_USERS = 'SysUser/FINISH_LIST_SYS_USERS';

export const actionListSysUsers = createAction(REQUEST_LIST_SYS_USERS);
const finishListSysUsers = createAction(FINISH_LIST_SYS_USERS);

// --- Saga

function* sagaListSysUsers(action) {
  let payload = action.payload;
  const {r, users} = yield call(listSysUsers, payload);
  if (!r) {
    yield put(finishListSysUsers({users}));
  }
}

export const saga = [
  takeLatest(REQUEST_LIST_SYS_USERS, sagaListSysUsers),
];

// --- Reducer

const reduceListSysUsers = (state, action) => {
  const users = action.payload.users;
  state = state.set('users', users);
  return state;
};

export const reducer = (state=SysUserState(), action) => {
  switch (action.type) {
    case FINISH_LIST_SYS_USERS:
      return reduceListSysUsers(state, action);
    default:
      return state;
  }
};
