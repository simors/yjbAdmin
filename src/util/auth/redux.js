import {call, put, takeLatest} from 'redux-saga/effects';
import {createAction} from 'redux-actions';
import {Record, Map, List} from 'immutable';
import {REHYDRATE} from 'redux-persist/constants';
import * as api from './cloud';

// --- model

class User extends Record({
  id: undefined,
  email: undefined,
  emailVerified: undefined,
  mobilePhoneNumber: undefined,
  mobilePhoneVerified: undefined,
  authData: undefined,
  username: undefined,            // unused for now, maybe for wechat id later
  nickname: undefined,            // wechat nickname
  avatar: undefined,
  sex: undefined,                 // gender
  language: undefined,
  country: undefined,
  province: undefined,
  city: undefined,
  idNumber: undefined,
  idName: undefined,              // real name
  createdAt: undefined,
  updatedAt: undefined,
  type: undefined,                // user type, e.g. system admin, platform admin, etc.
  note: undefined,                // note for this user
  roles: List(),                  // List<RoleInfo>
}, 'User') {
  static fromJson(j) {
    let info = new User();

    return info.withMutations((m) => {
      m.set('id', j.objectId);
      m.set('email', j.email);
      m.set('emailVerified', j.emailVerified);
      m.set('mobilePhoneNumber', j.mobilePhoneNumber);
      m.set('mobilePhoneVerified', j.mobilePhoneVerified);
      m.set('authData', j.authData);
      m.set('username', j.username);
      m.set('nickname', j.nickname);
      m.set('avatar', j.avatar);
      m.set('sex', j.sex);
      m.set('language', j.language);
      m.set('country', j.country);
      m.set('province', j.province);
      m.set('city', j.city);
      m.set('idNumber', j.idNumber);
      m.set('idName', j.idName);
      m.set('createdAt', j.createdAt);
      m.set('updatedAt', j.updatedAt);
      m.set('type', j.type);
      m.set('note', j.note);
      m.set('roles', new List(j.roles));
    });
  }
}

class Role extends Record({
  code: undefined,
  permissions: List(),        // List<Permission>
}, 'Role') {
  static fromJson(j) {
    let role = new Role();

    return role.withMutations((m) => {
      m.set('code', j.code);
      m.set('permissions', new List(j.permissions));
    })
  }
}

class Permission extends Record({
  code: undefined,
}, 'Permission') {
  static fromJson(j) {
    let perm = new Permission();

    return perm.withMutations((m) => {
      m.set('code', j.code);
    })
  }
}

class AuthState extends Record({
  loading: true,              // whether login with token has finished
  activeUserId: undefined,    // current login user
  token: undefined,           // current login user token
  users: Map(),               // Map<id, User>, id is objectId from leancloud
  roles: Map(),               // Map<id, Role>, id is objectId from leancloud
  permissions: Map(),         // Map<id, Permission>, id is objectId from leancloud
}, 'AuthState') {

}

// --- constant

const LOAD_DONE = 'AUTH/LOAD_DONE';
const LOGIN_WITH_MOBILE_PHONE = 'AUTH/LOGIN_WITH_MOBILE_PHONE';
const LOGIN_WITH_TOKEN = 'AUTH/LOGIN_WITH_TOKEN';
const LOGIN_DONE = 'AUTH/LOGIN_DONE';
const LOGOUT = 'AUTH/LOGOUT';
const LOGOUT_DONE = 'AUTH/LOGOUT_DONE';
const FETCH_USER_LIST = 'AUTH/FETCH_USER_LIST';
const FETCH_USER_LIST_DONE = 'AUTH/FETCH_USER_LIST_DONE';

// --- action

export const action = {
  loginWithMobilePhone: createAction(LOGIN_WITH_MOBILE_PHONE),
  loginWithToken: createAction(LOGIN_WITH_TOKEN),
  logout: createAction(LOGOUT),
  fetchUserList: createAction(FETCH_USER_LIST),
};

const loadDone = createAction(LOAD_DONE);
const loginDone = createAction(LOGIN_DONE);
const logoutDone = createAction(LOGOUT_DONE);
const fetchUserListDone = createAction(FETCH_USER_LIST_DONE);

// --- saga

export const saga = [
  takeLatest(LOGIN_WITH_MOBILE_PHONE, sagaLoginWithMobilePhone),
  takeLatest(LOGIN_WITH_TOKEN, sagaLoginWithToken),
  takeLatest(LOGOUT, sagaLogout),
  takeLatest(FETCH_USER_LIST, sagaFetchUserList),
];

function* sagaLoginWithMobilePhone(action) {
  const payload = action.payload;

  try {
    // result user = {
    //   userInfo,
    //   token
    // }
    const login = yield call(api.loginWithMobilePhone, payload);

    yield put(loginDone({login}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }

    console.log('login succeeded：', login);
  } catch (e) {
    console.log('login failed：', e);
  }
}

function* sagaLoginWithToken(action) {
  const payload = action.payload;

  try {
    const login = yield call(api.become, payload);

    yield put(loginDone({login}));

    console.log('login with token succeeded：', login);
  } catch(e) {
    console.log('login with token failed：', e);
  }

  yield put(loadDone({}));
}

function* sagaLogout(action) {
  const payload = action.payload;

  try {
    yield call(api.logout, payload);
  } catch (e) {
  }

  yield put(logoutDone({}));

  if (payload.onSuccess) {
    payload.onSuccess();
  }
}

function* sagaFetchUserList(action) {
  const payload = action.payload;

  const res = yield call(api.fetchUserList, payload);
  if (res.success) {
    yield put(fetchUserListDone({users: res.users}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } else {
    if (payload.onFailure) {
      payload.onFailure();
    }
  }
}

// --- reducer

const initialState = new AuthState();

export function reducer(state=initialState, action) {
  switch(action.type) {
    case LOAD_DONE:
      return reduceLoadDone(state, action);
    case LOGIN_DONE:
      return reduceLoginDone(state, action);
    case LOGOUT_DONE:
      return reduceLogoutDone(state, action);
    case FETCH_USER_LIST_DONE:
      return reduceFetchUserListDone(state, action);
    case REHYDRATE:
      return reduceRehydrate(state, action);
    default:
      return state
  }
}

function reduceLoadDone(state, action) {
  return state.set('loading', false);
}

function reduceLoginDone(state, action) {
  const {login} = action.payload;

  const user = User.fromJson(login.user);
  const token = login.token;

  return state.withMutations((m) => {
    m.set('activeUserId', user.id);
    m.set('token', token);
    m.setIn(['users', user.id], user);
  });
}

function reduceLogoutDone(state, action) {
  const activeUserId = state.get('activeUserId');

  return state.withMutations((m) => {
    m.set('activeUserId', undefined);
    m.set('token', undefined);
    m.deleteIn(['users', activeUserId]);
  });
}

function reduceFetchUserListDone(state, action) {
  const {users: jsonUsers} = action.payload;

  let users = new Map();

  users = users.withMutations((m) => {
    jsonUsers.forEach((i) => {
      const user = User.fromJson(i);
      m.set(user.id, user);
    })
  });

  return state.withMutations((m) => {
    m.setIn(["users"], users);
  });
}

function reduceRehydrate(state, action) {
  const incoming = action.payload.AUTH;

  if (!incoming) {
    return state;
  }

  if (!incoming.activeUserId) {
    return state;
  }

  // always re-auth with the server
  // state = state.set('activeUserId', incoming.activeUserId);
  state = state.set('token', incoming.token);

  // convert from plain json dict to immutable.js Map
  const users = Map(incoming.users);
  try {
    for (let [id, profile] of users) {
      if (id && profile) {
        const userInfo = new User({...profile});
        state = state.setIn(['users', id], userInfo);
      }
    }
  } catch (e) {
    users.clear();
  }

  return state;
}

// --- selector

export const selector = {
  selectLoading,
  selectActiveUserId,
  selectActiveUser,
  selectToken,
  selectIsUserLoggedIn,
  selectUser,
  selectUserById,
  selectUserByIds,
};

function selectLoading(appState) {
  return appState.AUTH.loading;
}

function selectActiveUserId(appState) {
  return appState.AUTH.activeUserId;
}

function selectActiveUser(appState) {
  const activeUserId = selectActiveUserId(appState);

  return activeUserId !== undefined ? selectUserById(appState, activeUserId) : undefined;
}

function selectToken(appState) {
  return appState.AUTH.token;
}

function selectIsUserLoggedIn(appState) {
  const activeUserId = selectActiveUserId(appState);
  return activeUserId !== undefined;
}

function selectUser(appState) {
  return appState.AUTH.getIn(['users'], new Map()).toArray();
}

function selectUserById(appState, id) {
  return appState.AUTH.getIn(['users', id], undefined);
}

function selectUserByIds(appState, ids) {
  let users = [];

  ids.forEach((id) => {
    const user = selectUserById(appState, id);

    // TODO: invalid user id ?
    if (user !== undefined) {
      users.push(user.toJS());
    }
  });

  return users;
}
