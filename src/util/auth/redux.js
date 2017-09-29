import {call, put, takeLatest} from 'redux-saga/effects';
import {createAction} from 'redux-actions';
import {Record, Map, List} from 'immutable';
import {REHYDRATE} from 'redux-persist/constants';
import * as authCloud from './cloud';

// --- model

class UserInfo extends Record({
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
  roles: List(),                  // List<RoleInfo>
}, 'UserInfo') {
  static fromJson(j) {
    let info = new UserInfo();

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
      m.set('roles', new List(j.roles));
    });
  }
}

class RoleInfo extends Record({
  code: undefined,
  permissions: List(),        // List<PermissionInfo>
}, 'RoleInfo') {
  static fromJson(j) {
    let role = new RoleInfo();

    return role.withMutations((m) => {
      m.set('code', j.code);
      m.set('permissions', new List(j.permissions));
    })
  }
}

class PermissionInfo extends Record({
  code: undefined,
}, 'PermissionInfo') {
  static fromJson(j) {
    let perm = new PermissionInfo();

    return perm.withMutations((m) => {
      m.set('code', j.code);
    })
  }
}

class AuthState extends Record({
  loaded: false,              // whether auto login has finished
  activeUserId: undefined,    // current login user
  token: undefined,           // current login user token
  users: Map(),               // Map<id, UserInfo>
  roles: Map(),               // Map<id, RoleInfo>
  permissions: Map(),         // Map<id, PermissionInfo>
}, 'AuthState') {

}

// --- constant

const LOADED = 'SAGA@AUTH/LOADED';
const LOGIN_WITH_MOBILE_PHONE = 'SAGA@AUTH/LOGIN_WITH_MOBILE_PHONE';
const AUTO_LOGIN = 'SAGA@AUTH/AUTO_LOGIN';
const LOGIN_SUCCESS = 'SAGA@AUTH/LOGIN_SUCCESS';
const LOGOUT = 'SAGA@AUTH/LOGOUT';
const LOGOUT_SUCCESS = 'SAGA@AUTH/LOGOUT_SUCCESS';

// --- action

export const authAction = {
  loginWithMobilePhone: createAction(LOGIN_WITH_MOBILE_PHONE),
  autoLogin: createAction(AUTO_LOGIN),
  logout: createAction(LOGOUT),
  loginSuccess: createAction(LOGIN_SUCCESS),
};

const loaded = createAction(LOADED);
const logoutSuccess = createAction(LOGOUT_SUCCESS);

// --- saga

function* sagaLoginWithMobilePhone(action) {
  const payload = action.payload;

  try {
    // result user: {
    //   userInfo,
    //   token
    // }
    const user = yield call(authCloud.loginWithMobilePhone, payload);

    yield put(authAction.loginSuccess({user}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }

    console.log('login succeeded：', user);
  } catch (e) {
    console.log('login failed：', e);
  }
}

function* sagaAutoLogin(action) {
  const payload = action.payload;

  try {
    const user = yield call(authCloud.become, payload);

    yield put(authAction.loginSuccess({user}));

    console.log('auto login succeeded：', user);
  } catch(e) {
    console.log('auto login failed：', e);
  }

  yield put(loaded({}));
}

function* sagaLogout(action) {
  const payload = action.payload;

  try {
    yield call(authCloud.logout, payload);
  } catch (e) {
  }

  yield put(logoutSuccess({}));

  if (payload.onSuccess) {
    payload.onSuccess();
  }
}

export const authSaga = [
  takeLatest(LOGIN_WITH_MOBILE_PHONE, sagaLoginWithMobilePhone),
  takeLatest(AUTO_LOGIN, sagaAutoLogin),
  takeLatest(LOGOUT, sagaLogout),
];

// --- reducer

const initialState = new AuthState();

export function authReducer(state=initialState, action) {
  switch(action.type) {
    case LOADED:
      return reduceLoaded(state, action);
    case LOGIN_SUCCESS:
      return reduceLoginSuccess(state, action);
    case LOGOUT_SUCCESS:
      return reduceLogoutSuccess(state, action);
    case REHYDRATE:
      return reduceRehydrate(state, action);
    default:
      return state
  }
}

function reduceLoaded(state, action) {
  return state.set('loaded', true);
}

function reduceLoginSuccess(state, action) {
  const {user} = action.payload;

  const info = UserInfo.fromJson(user.userInfo);
  const token = user.token;

  return state.withMutations((m) => {
    m.set('activeUserId', info.id);
    m.set('token', token);
    m.setIn(['users', info.id], info);
  });
}

function reduceLogoutSuccess(state, action) {
  const activeUserId = state.get('activeUserId');

  return state.withMutations((m) => {
    m.set('activeUserId', undefined);
    m.set('token', undefined);
    m.deleteIn(['users', activeUserId]);
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
        const userInfo = new UserInfo({...profile});
        state = state.setIn(['users', id], userInfo);
      }
    }
  } catch (e) {
    users.clear();
  }

  return state;
}

// --- selector

function selectLoaded(appState) {
  return appState.AUTH.loaded;
}

function selectActiveUserId(appState) {
  return appState.AUTH.activeUserId;
}

function selectActiveUserIdAndToken(appState) {
  return {
    activeUserId: appState.AUTH.activeUserId,
    token: appState.AUTH.token
  };
}

function selectIsUserLoggedIn(appState) {
  const activeUserId = selectActiveUserIdAndToken(appState).activeUserId;
  return activeUserId !== undefined;
}

function selectUserInfoById(appState, id) {
  return appState.AUTH.getIn(['users', id], undefined);
}

function selectUserInfoByIds(appState, ids) {
  let infos = [];

  ids.forEach((id) => {
    const info = selectUserInfoById(appState, id);

    // TODO: invalid user id ?
    if (info !== undefined) {
      infos.push(info.toJS());
    }
  });

  return infos;
}

function selectActiveUserInfo(appState) {
  const activeUserId = selectActiveUserId(appState);

  return activeUserId !== undefined ? appState.AUTH.selectUserInfoById(activeUserId) : undefined;
}

function selectToken(appState) {
  let AUTH = appState.AUTH;
  return AUTH.token;
}

export const authSelector = {
  selectLoaded,
  selectActiveUserId,
  selectIsUserLoggedIn,
  selectUserInfoById,
  selectUserInfoByIds,
  selectActiveUserInfo,
  selectToken,
};
