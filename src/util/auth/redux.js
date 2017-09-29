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
  roles: List(),
}, 'UserInfo') {
  static fromJsonApi(json) {
    let info = new UserInfo();

    return info.withMutations((m) => {
      m.set('id', json.objectId);
      m.set('email', json.email);
      m.set('emailVerified', json.emailVerified);
      m.set('mobilePhoneNumber', json.mobilePhoneNumber);
      m.set('mobilePhoneVerified', json.mobilePhoneVerified);
      m.set('authData', json.authData);
      m.set('username', json.username);
      m.set('nickname', json.nickname);
      m.set('avatar', json.avatar);
      m.set('sex', json.sex);
      m.set('language', json.language);
      m.set('country', json.country);
      m.set('province', json.province);
      m.set('city', json.city);
      m.set('idNumber', json.idNumber);
      m.set('idName', json.idName);
      m.set('createdAt', json.createdAt);
      m.set('updatedAt', json.updatedAt);
      m.set('type', json.type);
      m.set('roles', new List(json.roles));
    });
  }
}

class AuthState extends Record({
  loaded: false,      // whether auto login has finished
  activeUserId: undefined, // current login user
  token: undefined,        // current login user token
  profiles: Map(),    // cached user info list
}, 'AuthState') {

}

// --- constant

const LOADED = 'AUTH@LOADED';
const LOGIN_WITH_MOBILE_PHONE = 'LOGIN_WITH_MOBILE_PHONE';
const AUTO_LOGIN = 'AUTO_LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

// --- action

export const authAction = {
  loginWithMobilePhone: createAction(LOGIN_WITH_MOBILE_PHONE),
  autoLogin: createAction(AUTO_LOGIN),
  logout: createAction(LOGOUT),
  loginSuccess: createAction(LOGIN_SUCCESS),
};

const loaded = createAction(LOADED);
const logoutSuccess = createAction(LOGOUT_SUCCESS);

// saga

function* sagaLoginWithMobilePhone(action) {
  const payload = action.payload;

  try {
    // result user: {
    //   userInfo,
    //   token
    // }
    const user = yield call(authCloud.loginWithMobilePhone, payload);

    const info = UserInfo.fromJsonApi(user.userInfo);

    yield put(authAction.loginSuccess({userInfo: info, token: user.token}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }

    console.log('login succeeded：', info);
  } catch (e) {
    console.log('login failed：', e);
  }
}

function* sagaAutoLogin(action) {
  const payload = action.payload;

  try {
    const user = yield call(authCloud.become, payload);

    const info = UserInfo.fromJsonApi(user.userInfo);

    yield put(authAction.loginSuccess({userInfo: info, token: user.token}));

    console.log('auto login succeeded：', info);
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
  const {userInfo, token} = action.payload;

  return state.withMutations((m) => {
    m.set('activeUserId', userInfo.id);
    m.set('token', token);
    m.setIn(['profiles', userInfo.id], userInfo);
  });
}

function reduceLogoutSuccess(state, action) {
  const activeUserId = state.get('activeUserId');

  return state.withMutations((m) => {
    m.set('activeUserId', undefined);
    m.set('token', undefined);
    m.deleteIn(['profiles', activeUserId]);
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
  const profiles = Map(incoming.profiles);
  try {
    for (let [id, profile] of profiles) {
      if (id && profile) {
        const userInfo = new UserInfo({...profile});
        state = state.setIn(['profiles', id], userInfo);
      }
    }
  } catch (e) {
    profiles.clear();
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
  return appState.AUTH.getIn(['profiles', id], undefined);
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
