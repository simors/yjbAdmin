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

const State = Record({
  UserList: Map(),
  UserDetail: Map(),
  UserCreate: Map(),
  UserDelete: Map(),
  UserEdit: Map(),
}, "UserState");

// --- Action

const SAGA_USER_LIST_DATA_GET          = "SAGA@SysUser/UserList/data/get";
const SAGA_USER_DETAIL_MODAL_SHOW      = "SAGA@SysUser/UserDetail/modal/show";
const SAGA_USER_DETAIL_MODAL_HIDE      = "SAGA@SysUser/UserDetail/modal/hide";
const SAGA_USER_DETAIL_MODAL_DATA_GET  = "SAGA@SysUser/UserDetail/modal/data/get";

const REDUCE_USER_LIST_DATA            = "REDUCE@SysUser/UserList/data";
const REDUCE_USER_DETAIL_MODAL_SHOW    = "REDUCE@SysUser/UserDetail/modal/show";
const REDUCE_USER_DETAIL_MODAL_HIDE    = "REDUCE@SysUser/UserDetail/modal/hide";
const REDUCE_USER_DETAIL_MODAL_DATA    = "REDUCE@SysUser/UserDetail/modal/data";

export const sagaAction = {
  sagaUserListDataGet: createAction(SAGA_USER_LIST_DATA_GET),
  sagaUserDetailModalShow: createAction(SAGA_USER_DETAIL_MODAL_SHOW),
  sagaUserDetailModalHide: createAction(SAGA_USER_DETAIL_MODAL_HIDE),
  sagaUserDetailModalDataGet: createAction(SAGA_USER_DETAIL_MODAL_DATA_GET),
};

const reducerAction = {
  reduceUserListData: createAction(REDUCE_USER_LIST_DATA),
  reduceUserDetailModalShow: createAction(REDUCE_USER_DETAIL_MODAL_SHOW),
  reduceUserDetailModalHide: createAction(REDUCE_USER_DETAIL_MODAL_HIDE),
  reduceUserDetailModalData: createAction(REDUCE_USER_DETAIL_MODAL_DATA),
};

// --- Saga

function* sagaUserListDataGet(action) {
  const payload = action.payload;

  const res = yield call(api.getUserList, payload);
  if (res.success) {
    let users = [];
    res.users.forEach((i) => {
      users.push(User.fromJsonApi(i));
    });

    yield put(reducerAction.reduceUserListData({users}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } else {
    if (payload.onFailure) {
      payload.onFailure();
    }
  }
}

function* sagaUserDetailModalShow(action) {
  const payload = action.payload;

  yield put(reducerAction.reduceUserDetailModalShow());
  yield put(sagaAction.sagaUserDetailModalDataGet(payload));
}

function* sagaUserDetailModalHide(action) {
  yield put(reducerAction.reduceUserDetailModalHide());
}

function* sagaUserDetailModalDataGet(action) {
  const payload = action.payload;

  const res = yield call(api.getUserDetail, payload);
  if (res.success) {
    const user = User.fromJsonApi(res.user);

    yield put(reducerAction.reduceUserDetailModalData({user}));

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
  takeLatest(SAGA_USER_LIST_DATA_GET, sagaUserListDataGet),
  takeLatest(SAGA_USER_DETAIL_MODAL_SHOW, sagaUserDetailModalShow),
  takeLatest(SAGA_USER_DETAIL_MODAL_HIDE, sagaUserDetailModalHide),
  takeLatest(SAGA_USER_DETAIL_MODAL_DATA_GET, sagaUserDetailModalDataGet),
];

// --- Reducer

function reduceUserListData(state, action) {
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

function reduceUserDetailModalShow(state, action) {
  const payload = action.payload;

  return state.withMutations((m) => {
    m.setIn(["UserDetail", "visible"], true);
  })
}

function reduceUserDetailModalHide(state, action) {
  return state.setIn(["UserDetail", "visible"], false);
}

function reduceUserDetailModalData(state, action) {
  const payload = action.payload;
  const user = payload.user;

  return state.withMutations((m) => {
    m.setIn(["UserDetail", "data"], user);
  })
}

export const reducer = (state=State(), action) => {
  switch (action.type) {
    case REDUCE_USER_LIST_DATA:
      return reduceUserListData(state, action);
    case REDUCE_USER_DETAIL_MODAL_SHOW:
      return reduceUserDetailModalShow(state, action);
    case REDUCE_USER_DETAIL_MODAL_HIDE:
      return reduceUserDetailModalHide(state, action);
    case REDUCE_USER_DETAIL_MODAL_DATA:
      return reduceUserDetailModalData(state, action);
    default:
      return state;
  }
};

// --- Selector

function selectUserList_ids(appState) {
  const state = appState.SYSUSER;
  return state.getIn(["UserList", "ids"], List()).toArray();
}

function selectUserList_users(appState) {
  const state = appState.SYSUSER;
  return state.getIn(["UserList", "users"], Map()).toArray();
}

function selectUserDetail_visible(appState) {
  const state = appState.SYSUSER;
  return state.getIn(["UserDetail", "visible"], false);
}

function selectUserDetail_data(appState) {
  const state = appState.SYSUSER;
  return state.getIn(["UserDetail", "data"], Map()).toJS();
}

export const selector = {
  UserList: {
    ids: selectUserList_ids,
    users: selectUserList_users,
  },
  UserDetail: {
    visible: selectUserDetail_visible,
    data: selectUserDetail_data,
  },
};
