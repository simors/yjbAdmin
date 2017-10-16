import {call, put, takeLatest} from 'redux-saga/effects';
import {createAction} from 'redux-actions';
import {Record, Map, Set} from 'immutable';
import {REHYDRATE} from 'redux-persist/constants';
import * as api from './cloud';

// --- model

class User extends Record({
  objectId: undefined,            // objectId
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
  roles: Set(),                   // Set<role id>
}, 'User') {
  static fromJson(json) {
    const imm = new User();

    return imm.withMutations((m) => {
      m.set('objectId', json.objectId);
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
      m.set('note', json.note);
      m.set('roles', new Set(json.roles));
    });
  }

  static toJson(imm) {
    // NOTE: IE8 does not support property access. Only use get() when supporting IE8
    return {
      objectId: imm.objectId,
      email: imm.email,
      emailVerified: imm.emailVerified,
      mobilePhoneNumber: imm.mobilePhoneNumber,
      mobilePhoneVerified: imm.mobilePhoneVerified,
      authData: imm.authData,
      username: imm.username,
      nickname: imm.nickname,
      avatar: imm.avatar,
      sex: imm.sex,
      language: imm.language,
      country: imm.country,
      province: imm.province,
      city: imm.city,
      idNumber: imm.idNumber,
      idName: imm.idName,
      createdAt: imm.createdAt,
      updatedAt: imm.updatedAt,
      type: imm.type,
      note: imm.note,
      roles: imm.get('roles', new Set()).toArray(),
    };
  }
}

class Role extends Record({
  objectId: undefined,              // objectId
  name: undefined,
  code: undefined,
  displayName: undefined,
  permissions: Set(),               // Set<permission id>
}, 'Role') {
  static fromJson(json) {
    const role = new Role();

    return role.withMutations((m) => {
      m.set('objectId', json.objectId);
      m.set('name', json.name);
      m.set('code', json.code);
      m.set('displayName', json.displayName);
      m.set('permissions', new Set(json.permissions));
    })
  }

  static toJson(imm) {
    return {
      objectId: imm.objectId,
      name: imm.name,
      code: imm.code,
      displayName: imm.displayName,
      permissions: imm.get('permissions', new Set()).toArray(),
    };
  }
}

class Permission extends Record({
  objectId: undefined,              // objectId
  code: undefined,
  displayName: undefined,
}, 'Permission') {
  static fromJson(json) {
    const perm = new Permission();

    return perm.withMutations((m) => {
      m.set('objectId', json.objectId);
      m.set('code', json.code);
      m.set('displayName', json.displayName);
    })
  }

  static toJson(imm) {
    return {
      objectId: imm.objectId,
      code: imm.code,
      displayName: imm.displayName,
    };
  }
}

// NOTE: id is objectId from leancloud
class AuthState extends Record({
  loading: true,                // whether login with token has finished
  token: undefined,             // current login user token
  activeUserId: undefined,      // current login user
  activeRoleIds: Set(),         // Set<role id>
  activePermissionIds: Set(),   // Set<permission id>
  usersById: Map(),             // Map<id, User>
  rolesById: Map(),             // Map<role id, Role>
  permissionsById: Map(),       // Map<permission id, Permission>

  allUsers: Set(),              // Set<user id>
  allAdminUsers: Set(),         // Set<user id>
  userIdsByRole: Map(),         // Map<role id, Set<user id>>
}, 'AuthState') {

}

// --- constant

const LOADED = 'AUTH/LOADED';
const LOGIN_WITH_MOBILE_PHONE = 'AUTH/LOGIN_WITH_MOBILE_PHONE';
const LOGIN_WITH_TOKEN = 'AUTH/LOGIN_WITH_TOKEN';
const LOGGED_IN = 'AUTH/LOGGED_IN';
const LOGOUT = 'AUTH/LOGOUT';
const LOGGED_OUT = 'AUTH/LOGGED_OUT';
const LIST_USERS = 'AUTH/LIST_USERS';
const LISTED_USERS = 'AUTH/LISTED_USERS';
const CREATE_USER = 'AUTH/CREATE_USER';
const DELETE_USER = 'AUTH/DELETE_USER';
const UPDATE_USER = 'AUTH/UPDATE_USER';

// --- action

export const action = {
  loginWithMobilePhone: createAction(LOGIN_WITH_MOBILE_PHONE),
  loginWithToken: createAction(LOGIN_WITH_TOKEN),
  logout: createAction(LOGOUT),

  listUsers: createAction(LIST_USERS),
  createUser: createAction(CREATE_USER),
  deleteUser: createAction(DELETE_USER),
  updateUser: createAction(UPDATE_USER),
};

const loaded = createAction(LOADED);
const loggedIn = createAction(LOGGED_IN);
const loggedOut = createAction(LOGGED_OUT);
const listedUsers = createAction(LISTED_USERS);

// --- saga

export const saga = [
  takeLatest(LOGIN_WITH_MOBILE_PHONE, sagaLoginWithMobilePhone),
  takeLatest(LOGIN_WITH_TOKEN, sagaLoginWithToken),
  takeLatest(LOGOUT, sagaLogout),
  takeLatest(LIST_USERS, sagaListUser),
  takeLatest(CREATE_USER, sagaCreateUser),
  takeLatest(DELETE_USER, sagaDeleteUser),
  takeLatest(UPDATE_USER, sagaUpdateUser),
];

function* sagaLoginWithMobilePhone(action) {
  const payload = action.payload;

  try {
    const login = yield call(api.loginWithMobilePhone, payload);

    yield put(loggedIn({login}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }

    console.log('login succeeded：', login);
  } catch (e) {
    if (payload.onFailure) {
      payload.onFailure();
    }

    console.log('login failed：', e);
    console.log('code: ', e.code);
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaLoginWithToken(action) {
  const payload = action.payload;

  try {
    const login = yield call(api.become, payload);

    yield put(loggedIn({login}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }

    console.log('login with token succeeded：', login);
  } catch(e) {
    if (payload.onFailure) {
      payload.onFailure();
    }

    console.log('login with token failed：', e);
    console.log('code: ', e.code);
  }

  yield put(loaded({}));

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaLogout(action) {
  const payload = action.payload;

  try {
    yield call(api.logout, payload);

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    if (payload.onFailure) {
      payload.onFailure();
    }
  }

  yield put(loggedOut({}));

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaListUser(action) {
  const payload = action.payload;

  try {
    const {params} = payload;

    const jsonUsers = yield call(api.listUsers, params);
    yield put(listedUsers({jsonUsers}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    console.log('fetch user list failed：', e);
    console.log('code: ', e.code);

    if (payload.onFailure) {
      payload.onFailure();
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaCreateUser(action) {
  const payload = action.payload;

  try {
    const {params} = payload;

    yield call(api.createUser, params);

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    console.log('create user failed：', e);
    console.log('code: ', e.code);

    if (payload.onFailure) {
      payload.onFailure();
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaDeleteUser(action) {
  const payload = action.payload;

  try {
    const {params} = payload;

    yield call(api.deleteUser, params);

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    console.log('delete user failed：', e);
    console.log('code: ', e.code);

    if (payload.onFailure) {
      payload.onFailure();
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaUpdateUser(action) {
  const payload = action.payload;

  try {
    const {params} = payload;

    yield call(api.updateUser, params);

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    console.log('update user failed：', e);
    console.log('code: ', e.code);

    if (payload.onFailure) {
      payload.onFailure();
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

// --- reducer

const initialState = new AuthState();

export function reducer(state=initialState, action) {
  switch(action.type) {
    case LOADED:
      return reduceLoaded(state, action);
    case LOGGED_IN:
      return reduceLoggedIN(state, action);
    case LOGGED_OUT:
      return reduceLoggedOut(state, action);
    case LISTED_USERS:
      return reduceListedUsers(state, action);
    case REHYDRATE:
      return reduceRehydrate(state, action);
    default:
      return state
  }
}

function reduceLoaded(state, action) {
  return state.set('loading', false);
}

function reduceLoggedIN(state, action) {
  const {login} = action.payload;
  const {jsonActiveUser, token, jsonActiveRoleIds, jsonAllRoles, jsonAllPermissions} = login;

  // 'activeRoleIds'
  const immActiveRoleIds = new Set(jsonActiveRoleIds);

  // since we login from client side, e.g., browser, the roles of the login user
  // were fetched separately
  const immActiveUser = User.fromJson(jsonActiveUser).set('roles', immActiveRoleIds);

  // 'roles'
  const immAllRolesById = new Map().withMutations((m) => {
    jsonAllRoles.forEach((i) => {
      const immRole = Role.fromJson(i);
      m.set(immRole.objectId, immRole);
    });
  });

  // 'permissions'
  const immAllPermissionsById = new Map().withMutations((m) => {
    jsonAllPermissions.forEach((i) => {
      const immPermission = Permission.fromJson(i);
      m.set(immPermission.objectId, immPermission);
    });
  });

  // 'activePermissionIds'
  const immActivePermissionIds = new Set().withMutations((m) => {
    immActiveRoleIds.forEach((i) => {
      const immRole = immAllRolesById.get(i);
      const immPermissionIds = immRole.get('permissions');
      m.union(immPermissionIds);
    });
  });

  return state.withMutations((m) => {
    m.set('token', token);
    m.set('activeUserId', immActiveUser.objectId);
    m.set('activeRoleIds', immActiveRoleIds);
    m.set('activePermissionIds', immActivePermissionIds);
    m.setIn(['usersById', immActiveUser.objectId], immActiveUser);
    m.set('rolesById', immAllRolesById);
    m.set('permissionsById', immAllPermissionsById);
  });
}

function reduceLoggedOut(state, action) {
  const activeUserId = state.get('activeUserId');

  return state.withMutations((m) => {
    m.set('activeUserId', undefined);
    m.set('token', undefined);
    m.deleteIn(['usersById', activeUserId]);
  });
}

function reduceListedUsers(state, action) {
  const {jsonUsers} = action.payload;

  const immUsers = [];
  jsonUsers.forEach((i) => {
    const immUser = User.fromJson(i);
    immUsers.push(immUser);
  });

  return state.withMutations((m) => {
    immUsers.forEach((i) => {
      m.setIn(['usersById', i.objectId], i);
    });
  });
}

function reduceRehydrate(state, action) {
  const storage = action.payload.AUTH;

  if (storage === undefined)
    return state;

  // all data in json format
  const {token, activeUserId, activeRoleIds, activePermissionIds, usersById, rolesById, permissionsById} = storage;

  const immActiveRoleIds = new Set(activeRoleIds);
  const immActivePermissionIds = new Set(activePermissionIds);

  const immAllUsersById = new Map().withMutations((m) => {
    Object.values(usersById).forEach((i) => {
      const immUser = User.fromJson(i);
      m.set(immUser.objectId, immUser);
    });
  });

  const immAllRolesById = new Map().withMutations((m) => {
    Object.values(rolesById).forEach((i) => {
      const immRole = Role.fromJson(i);
      m.set(immRole.objectId, immRole);
    });
  });

  // 'permissions'
  const immAllPermissionsById = new Map().withMutations((m) => {
    Object.values(permissionsById).forEach((i) => {
      const immPermission = Permission.fromJson(i);
      m.set(immPermission.objectId, immPermission);
    });
  });

  return state.withMutations((m) => {
    m.set('token', token);
    // m.set('activeUserId', activeUserId);   // always re-auth with the server
    m.set('activeRoleIds', immActiveRoleIds);
    m.set('activePermissionIds', immActivePermissionIds);
    m.set('usersById', immAllUsersById);
    m.set('rolesById', immAllRolesById);
    m.set('permissionsById', immAllPermissionsById);
  });
}

// --- selector

export const selector = {
  selectLoading,
  selectActiveUserId,
  selectActiveUser,
  selectToken,
  selectIsUserLoggedIn,
  selectAllRoles,
  selectAllUsers,
  selectAdminUsers,
  selectUserById,
};

function selectLoading(appState) {
  return appState.AUTH.loading;
}

function selectActiveUserId(appState) {
  return appState.AUTH.activeUserId;
}

function selectActiveUser(appState) {
  const activeUserId = selectActiveUserId(appState);

  if (activeUserId === undefined)
    return undefined;

  return selectUserById(appState, activeUserId);
}

function selectToken(appState) {
  return appState.AUTH.token;
}

function selectIsUserLoggedIn(appState) {
  const activeUserId = selectActiveUserId(appState);
  return activeUserId !== undefined;
}

function selectAllRoles(appState) {
  const allRoles = [];

  const allImmRoles = appState.AUTH.getIn(['rolesById'], new Map()).toArray();
  allImmRoles.forEach((i) => {
    allRoles.push(Role.toJson(i));
  });

  return allRoles;
}

function selectAllUsers(appState) {
  const allUsers = [];

  const allImmUsers = appState.AUTH.getIn(['usersById'], new Map()).toArray();
  allImmUsers.forEach((i) => {
    allUsers.push(User.toJson(i));
  });

  return allUsers;
}

function selectAdminUsers(appState) {
  const adminUsers = [];

  const allUsers = selectAllUsers(appState);
  allUsers.forEach((i) => {
    if (i.type === 'admin') {
      adminUsers.push(i);
    }
  });

  return adminUsers;
}

function selectUserById(appState, id) {
  const immUser = appState.AUTH.getIn(['usersById', id], undefined);

  if (immUser === undefined)
    return undefined;

  return User.toJson(immUser);
}
