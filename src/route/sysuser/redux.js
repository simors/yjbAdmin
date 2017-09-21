import {createAction} from './util';
import {call, put, takeLatest} from 'redux-saga/effects';
import {Record, List, Map} from 'immutable';
import * as api from './cloud';

// --- Action

const SAGA_USER_LIST = "SAGA@sysuser/USER/LIST";
const SAGA_USER_SHOW = "SAGA@sysuser/USER/SHOW";
const SAGA_USER_CREATE = "SAGA@sysuser/USER/CREATE";
const SAGA_USER_EDIT = "SAGA@sysuser/USER/EDIT";
const SAGA_USER_DELETE = "SAGA@sysuser/USER/DELETE";
const SAGA_USER_SAVE = "SAGA@sysuser/USER/SAVE";

export const action = {
  userList: createAction(SAGA_USER_LIST),
  userShow: createAction(SAGA_USER_SHOW),
  userCreate: createAction(SAGA_USER_CREATE),
  userEdit: createAction(SAGA_USER_EDIT),
  userDelete: createAction(SAGA_USER_DELETE),
  userSave: createAction(SAGA_USER_SAVE),
};

const REDUCER_USER_LIST = "REDUCER@sysuser/USER/LIST";
const REDUCER_USER_SHOW = "REDUCER@sysuser/USER/SHOW";
const REDUCER_USER_CREATE = "REDUCER@sysuser/USER/CREATE";
const REDUCER_USER_EDIT = "REDUCER@sysuser/USER/EDIT";
const REDUCER_USER_DELETE = "REDUCER@sysuser/USER/DELETE";
const REDUCER_USER_SAVE = "REDUCER@sysuser/USER/SAVE";

const reducerAction = {
  userList: createAction(REDUCER_USER_LIST),
  userShow: createAction(REDUCER_USER_SHOW),
  userCreate: createAction(REDUCER_USER_CREATE),
  userEdit: createAction(REDUCER_USER_EDIT),
  userDelete: createAction(REDUCER_USER_DELETE),
  userSave: createAction(REDUCER_USER_SAVE),
};

// --- Saga

function* saga_userList(action) {
  const payload = action.payload;

  const res = yield call(api.userList, payload);
  if (res.success) {
    // transform from http json response to an array of immutable.js Record
    let users = [];
    res.users.forEach((i) => {
      users.push(User.fromJsonApi(i));
    });

    yield put(reducerAction.userList({users}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } else {
    if (payload.onFailure) {
      payload.onFailure();
    }
  }
}

function* saga_userShow(action) {
  const payload = action.payload;

  const res = yield call(api.userShow, payload);
  if (res.success) {
    const user = User.fromJsonApi(res.user);

    yield put(reducerAction.userShow({user}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } else {
    if (payload.onFailure) {
      payload.onFailure();
    }
  }
}

function* saga_userCreate(action) {
  const payload = action.payload;

  const res = yield call(api.userCreate, payload);
  if (res.success) {
    const user = User.fromJsonApi(res.user);

    yield put(reducerAction.userCreate({user}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } else {
    if (payload.onFailure) {
      payload.onFailure();
    }
  }
}

function* saga_userEdit(action) {
  const payload = action.payload;

  const res = yield call(api.userEdit, payload);
  if (res.success) {
    const user = User.fromJsonApi(res.user);

    yield put(reducerAction.userEdit({user}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } else {
    if (payload.onFailure) {
      payload.onFailure();
    }
  }
}

function* saga_userDelete(action) {
  const payload = action.payload;

  const res = yield call(api.userDelete, payload);
  if (res.success) {
    const user = User.fromJsonApi(res.user);

    yield put(reducerAction.userDelete({user}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } else {
    if (payload.onFailure) {
      payload.onFailure();
    }
  }
}

function* saga_userSave(action) {
  const payload = action.payload;

  const res = yield call(api.userSave, payload);
  if (res.success) {
    const user = User.fromJsonApi(res.user);

    yield put(reducerAction.userSave({user}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } else {
    if (payload.onFailure) {
      payload.onFailure();
    }
  }
}

export const saga = [
  takeLatest(SAGA_USER_LIST, saga_userList),
  takeLatest(SAGA_USER_SHOW, saga_userShow),
  takeLatest(SAGA_USER_CREATE, saga_userCreate),
  takeLatest(SAGA_USER_EDIT, saga_userEdit),
  takeLatest(SAGA_USER_DELETE, saga_userDelete),
  takeLatest(SAGA_USER_SAVE, saga_userSave),
];

// --- State

const UserState = Record({
  userIds: List(),
  users: Map(),
}, "UserState");

class User extends Record({
  id: null,
  name: null,
  phoneNo: null,
  note: null,
  roles: null
}, "User") {
  static fromJsonApi(json) {
    let user = new User();
    return user.withMutations((m) => {
      m.set('id', json.id);
      m.set('name', json.name);
      m.set('phoneNo', json.phoneNo);
      m.set('note', json.note);
      m.set('roles', json.roles);
    })
  }
}

// --- Selector

function select_users(appState) {
  const state = appState.SYSUSER;
  return state.get('users').toArray();
}

function select_userIds(appState) {
  const state = appState.SYSUSER;
  return state.get('userIds').toArray();
}

export const selector = {
  userIds: select_userIds,
  users: select_users,
};

// --- Reducer

function reduce_userList(state, action) {
  const payload = action.payload;
  const rawUsers = payload.users; // an array of immutable.js Record

  let userIds = new List();
  let users = new Map();

  userIds = userIds.withMutations((m) => {
    rawUsers.forEach((i) => {
      m.push(i.id);
    });
  });

  users = users.withMutations((m) => {
    rawUsers.forEach((i) => {
      m.set(i.id, i);
    })
  });

  return state.withMutations((m) => {
    m.set('userIds', userIds);
    m.setIn(['users'], users);
  });
}

export const reducer = (state=UserState(), action) => {
  switch (action.type) {
    case REDUCER_USER_LIST:
      return reduce_userList(state, action);
    default:
      return state;
  }
};
