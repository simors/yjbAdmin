import {createAction} from './util';
import {call, put, takeLatest} from 'redux-saga/effects';
import {Record, List, Map} from 'immutable';
import * as api from './cloud';

// --- State

class User extends Record({
  id: null,
  name: null,
  password: null,
  phoneNo: null,
  note: null,
  roles: null
}, "User") {
  static fromJsonApi(json) {
    let user = new User();
    return user.withMutations((m) => {
      m.set("id", json.id);
      m.set("name", json.name);
      m.set("password", json.password);
      m.set("phoneNo", json.phoneNo);
      m.set("note", json.note);
      m.set("roles", json.roles);
    })
  }
}

const UserState = Record({
  UserList: Map(),
  UserDetail: Map(),
  UserCreate: Map(),
  UserDelete: Map(),
  UserEdit: Map(),
}, "UserState");

// --- Action

const SAGA_User_update = "SAGA@sysuser/User/update";
const SAGA_UserList_fetch = "SAGA@sysuser/UserList/fetch";
const SAGA_UserDetail_open = "SAGA@sysuser/UserDetail/open";
const SAGA_UserDetail_close = "SAGA@sysuser/UserDetail/close";

export const sagaAction = {
  User_update: createAction(SAGA_User_update),
  UserList_fetch: createAction(SAGA_UserList_fetch),
  UserDetail_open: createAction(SAGA_UserDetail_open),
  UserDetail_close: createAction(SAGA_UserDetail_close),
};

const REDUCER_User_update = "REDUCER@sysuser/User/update";
const REDUCER_UserList_fetch = "REDUCER@sysuser/UserList/fetch";
const REDUCER_UserDetail_open = "REDUCER@sysuser/UserDetail/open";
const REDUCER_UserDetail_close = "REDUCER@sysuser/UserDetail/close";
const REDUCER_UserDetail_set = "REDUCER@sysuser/UserDetail/set";

const reducerAction = {
  User_update: createAction(REDUCER_User_update),
  UserList_fetch: createAction(REDUCER_UserList_fetch),
  UserDetail_open: createAction(REDUCER_UserDetail_open),
  UserDetail_close: createAction(REDUCER_UserDetail_close),
  UserDetail_set: createAction(REDUCER_UserDetail_set),
};

// --- Saga

function* saga_User_update(action) {
  const payload = action.payload;

  const res = yield call(api.User_update, payload);
  if (res.success) {
    let user = User.fromJsonApi(res.user);

    yield put(reducerAction.User_update({user}));
    yield put(sagaAction.UserList_fetch());

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } else {
    if (payload.onFailure) {
      payload.onFailure();
    }
  }
}

function* saga_UserList_fetch(action) {
  const payload = action.payload;

  const res = yield call(api.User_fetch, payload);
  if (res.success) {
    let users = [];
    res.users.forEach((i) => {
      users.push(User.fromJsonApi(i));
    });

    yield put(reducerAction.UserList_fetch({users}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } else {
    if (payload.onFailure) {
      payload.onFailure();
    }
  }
}

function* saga_UserDetail_open(action) {
  const payload = action.payload;

  yield put(reducerAction.UserDetail_open());

  const res = yield call(api.User_detail, payload);
  if (res.success) {
    const user = User.fromJsonApi(res.user);

    yield put(reducerAction.UserDetail_set({user}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } else {
    if (payload.onFailure) {
      payload.onFailure();
    }
  }
}

function* saga_UserDetail_close(action) {
  yield put(reducerAction.UserDetail_close());
}

export const saga = [
  takeLatest(SAGA_User_update, saga_User_update),
  takeLatest(SAGA_UserList_fetch, saga_UserList_fetch),
  takeLatest(SAGA_UserDetail_open, saga_UserDetail_open),
  takeLatest(SAGA_UserDetail_close, saga_UserDetail_close),
];

// --- Reducer

function reduce_UserList_fetch(state, action) {
  const payload = action.payload;
  const rawUsers = payload.users; // an array of immutable.js Record

  let ids = new List();
  let users = new Map();

  ids = ids.withMutations((m) => {
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
    m.setIn(["UserList", "ids"], ids);
    m.setIn(["UserList", "users"], users);
  });
}

function reduce_UserDetail_open(state, action) {
  const payload = action.payload;

  return state.withMutations((m) => {
    m.setIn(["UserDetail", "visible"], true);
  })
}

function reduce_UserDetail_close(state, action) {
  return state.setIn(["UserDetail", "visible"], false);
}

function reduce_UserDetail_set(state, action) {
  const payload = action.payload;
  const user = payload.user;

  return state.withMutations((m) => {
    m.setIn(["UserDetail", "data"], user);
  })
}

export const reducer = (state=UserState(), action) => {
  switch (action.type) {
    case REDUCER_UserList_fetch:
      return reduce_UserList_fetch(state, action);
    case REDUCER_UserDetail_open:
      return reduce_UserDetail_open(state, action);
    case REDUCER_UserDetail_close:
      return reduce_UserDetail_close(state, action);
    case REDUCER_UserDetail_set:
      return reduce_UserDetail_set(state, action);
    default:
      return state;
  }
};

// --- Selector

function select_UserList_ids(appState) {
  const state = appState.SYSUSER;
  return state.getIn(["UserList", "ids"], List()).toArray();
}

function select_UserList_users(appState) {
  const state = appState.SYSUSER;
  return state.getIn(["UserList", "users"], Map()).toArray();
}

function select_UserDetail_visible(appState) {
  const state = appState.SYSUSER;
  return state.getIn(["UserDetail", "visible"], false);
}

function select_UserDetail_data(appState) {
  const state = appState.SYSUSER;
  return state.getIn(["UserDetail", "data"], Map()).toJS();
}

export const selector = {
  UserList: {
    ids: select_UserList_ids,
    users: select_UserList_users,
  },
  UserDetail: {
    visible: select_UserDetail_visible,
    data: select_UserDetail_data,
  },

};
