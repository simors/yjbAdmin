import {createAction} from 'redux-actions';
import {call, put, takeLatest} from 'redux-saga/effects';
import {Record} from 'immutable';
import {listUser} from './api';

// --- State

const UserState = Record({
  users: null,
}, "UserState");

// --- Selector

export function selectUsers(appState) {
  const state = appState.sysuser;
  return state.users;
}

// --- Action

const LIST_USER = 'SysUser/LIST_USER';
const LIST_USER_DONE = 'SysUser/LIST_USER_DONE';

export const dispatchListUser = createAction(LIST_USER);
const dispatchListUserDone = createAction(LIST_USER_DONE);

// --- Saga

function* sagaListUser(action) {
  let payload = action.payload;
  const {r, users} = yield call(listUser, payload);
  if (!r) {
    yield put(dispatchListUserDone({users}));
  }
}

export const saga = [
  takeLatest(LIST_USER, sagaListUser),
];

// --- Reducer

const reduceListUser = (state, action) => {
  const users = action.payload.users;
  state = state.set('users', users);
  return state;
};

export const reducer = (state=UserState(), action) => {
  switch (action.type) {
    case LIST_USER_DONE:
      return reduceListUser(state, action);
    default:
      return state;
  }
};
