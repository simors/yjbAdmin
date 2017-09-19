import {createAction} from 'redux-actions';
import {call, put, takeLatest} from 'redux-saga/effects';
import {Record, List} from 'immutable';
import * as api from './api';

// --- State

const UserState = Record({
  users: List(),
}, "UserState");

class User extends Record({
  id: null,
  name: null,
  phoneNo: null,
  note: null,
  roles: null
}, "User") {
  static fromJsonApi(jsonData) {
    let user = new User();
    return user.withMutations((i) => {
      i.set('id', jsonData.id);
      i.set('name', jsonData.name);
      i.set('phoneNo', jsonData.phoneNo);
      i.set('note', jsonData.note);
      i.set('roles', jsonData.roles);
    })
  }
}

// --- Selector

function selectUsers(appState) {
  const state = appState.SYSUSER;
  let users = [];
  if (state.users.size > 0) {
    state.users.forEach((i) => {
      users.push(i);
    })
  }
  return users;
}

export const selector = {
  selectUsers,
};

// --- Action

const LIST_USER = "SysUser/LIST_USER";
const LIST_USER_DONE = "SysUser/LIST_USER_DONE";
const SAVE_ROLE = "SysUser/SAVE_ROLE";

export const action = {
  listUser: createAction(LIST_USER),
  saveRole: createAction(SAVE_ROLE),
};

const listUserDone = createAction(LIST_USER_DONE);

// --- Saga

function* sagaListUser(action) {
  const {r, users: rawUsers} = yield call(api.listUser, action.payload);
  if (!r) {
    // transform from http json response to an array of immutable.js Record
    let users = [];
    rawUsers.forEach((i) => {
      users.push(User.fromJsonApi(i));
    });

    yield put(listUserDone({users}));
  }
}

function* sagaSaveRole(action) {
  console.log("[DEBUG] ---> sagaSaveRole, action: ", action);
}

export const saga = [
  takeLatest(LIST_USER, sagaListUser),
  takeLatest(SAVE_ROLE, sagaSaveRole),
];

// --- Reducer

const reduceListUser = (state, action) => {
  const users = action.payload.users;
  state = state.set('users', new List(users));
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
