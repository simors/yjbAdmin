import {call, put, select, takeLatest} from 'redux-saga/effects';
import {createAction} from 'redux-actions';
import {Record, Map, Set, List} from 'immutable';
import {REHYDRATE} from 'redux-persist/constants';
import * as api from './cloud';

// --- model

class User extends Record({
  id: undefined,                  // objectId
  state: undefined,               // 'disabled'/'deleted'
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
  idNameVerified: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  type: undefined,                // user type, e.g. end user or admin user
  roles: Set(),                   // Set<role id>
  note: undefined,                // note for this user
  subscribe: undefined,
}, 'User') {
  static fromJson(json) {
    const imm = new User();

    return imm.withMutations((m) => {
      m.set('id', json.id);
      m.set('state', json.state);
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
      m.set('idNameVerified', json.idNameVerified);
      m.set('createdAt', json.createdAt);
      m.set('updatedAt', json.updatedAt);
      m.set('type', json.type);
      m.set('roles', new Set(json.roles));
      m.set('note', json.note);
      m.set('subscribe', json.subscribe);
    });
  }

  static toJson(imm) {
    // NOTE: IE8 does not support property access. Only use get() when supporting IE8
    return {
      id: imm.id,
      state: imm.state,
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
      idNameVerified: imm.idNameVerified,
      createdAt: imm.createdAt,
      updatedAt: imm.updatedAt,
      type: imm.type,
      note: imm.note,
      subscribe: imm.subscribe,
      roles: imm.get('roles', new Set()).toArray(),
    };
  }
}

class Role extends Record({
  id: undefined,                  // objectId
  name: undefined,
  code: undefined,
  displayName: undefined,
  permissions: Set(),             // Set<permission id>
}, 'Role') {
  static fromJson(json) {
    const role = new Role();

    return role.withMutations((m) => {
      m.set('id', json.id);
      m.set('code', json.code);
      m.set('displayName', json.displayName);
      m.set('permissions', new Set(json.permissions));
    })
  }

  static toJson(imm) {
    return {
      id: imm.id,
      code: imm.code,
      displayName: imm.displayName,
      permissions: imm.get('permissions', new Set()).toArray(),
    };
  }
}

class Permission extends Record({
  id: undefined,                  // objectId
  code: undefined,
  displayName: undefined,
}, 'Permission') {
  static fromJson(json) {
    const perm = new Permission();

    return perm.withMutations((m) => {
      m.set('id', json.id);
      m.set('code', json.code);
      m.set('displayName', json.displayName);
    })
  }

  static toJson(imm) {
    return {
      id: imm.id,
      code: imm.code,
      displayName: imm.displayName,
    };
  }
}

// NOTE: id is objectId from leancloud
class AuthState extends Record({
  loading: true,                // whether login with token has finished
  token: undefined,             // current login user token
  curUserId: undefined,         // current login user
  curRoleIds: Set(),            // Set<role id>
  curPermissionIds: Set(),      // Set<permission id>

  rolesById: Map(),             // Map<role id, Role>
  permissionsById: Map(),       // Map<permission id, Permission>

  endUsers: List(),             // List<user id>
  adminUsers: List(),           // List<user id>
  usersByRole: Map(),      // Map<role id, Set<user id>>

  cachedUsersById: Map(),       // Map<user id, User>
}, 'AuthState') {

}

// --- constant

const LOADED = 'AUTH/LOADED';
const LOGIN_WITH_MOBILE_PHONE = 'AUTH/LOGIN_WITH_MOBILE_PHONE';
const LOGIN_WITH_TOKEN = 'AUTH/LOGIN_WITH_TOKEN';
const LOGGED_IN = 'AUTH/LOGGED_IN';
const LOGOUT = 'AUTH/LOGOUT';
const LOGGED_OUT = 'AUTH/LOGGED_OUT';
const LIST_END_USERS = 'AUTH/LIST_END_USERS';
const LISTED_END_USERS = 'AUTH/LISTED_END_USERS';
const LIST_ADMIN_USERS = 'AUTH/LIST_ADMIN_USERS';
const LISTED_ADMIN_USERS = 'AUTH/LISTED_ADMIN_USERS';
const LIST_USERS_BY_ROLE = 'AUTH/LIST_USERS_BY_ROLE';
const LISTED_USERS_BY_ROLE = 'AUTH/LISTED_USERS_BY_ROLE';
const CREATE_USER = 'AUTH/CREATE_USER';
const DELETE_USER = 'AUTH/DELETE_USER';
const UPDATE_USER = 'AUTH/UPDATE_USER';

const CACHED_USER = 'AUTH/CACHED_USER';
const CACHED_USERS = 'AUTH/CACHED_USERS';

// --- action

// action payload = {
//   ...action specific payload,
//   onSuccess: func,
//   onFailure: func,
//   onComplete: func,
// }
export const action = {
  // loginWithMobilePhone payload = {
  //   phone,
  //   password,
  // }
  loginWithMobilePhone: createAction(LOGIN_WITH_MOBILE_PHONE),
  // loginWithToken payload = {
  //   token,
  // }
  loginWithToken: createAction(LOGIN_WITH_TOKEN),
  // logout payload = {
  // }
  logout: createAction(LOGOUT),
  // listEndUsers payload = {
  //   limit?,
  //   lastCreatedAt?,
  // }
  listEndUsers: createAction(LIST_END_USERS),
  // listEndUsers payload = {
  //   limit?,
  //   lastCreatedAt?,
  //   idName?,
  //   mobilePhoneNumber?,
  // }
  listAdminUsers: createAction(LIST_ADMIN_USERS),
  // listUsersByRole payload = {
  //   limit?,
  //   lastCreatedAt?,
  //   roleId,
  // }
  listUsersByRole: createAction(LIST_USERS_BY_ROLE),

  createUser: createAction(CREATE_USER),
  deleteUser: createAction(DELETE_USER),
  updateUser: createAction(UPDATE_USER),

  // saveUser payload = {
  //   user: User,
  // }
  saveUser: createAction(CACHED_USER),
  // saveUsers payload = {
  //   users: Array<User>,
  // }
  saveUsers: createAction(CACHED_USERS),
};

const loaded = createAction(LOADED);
const loggedIn = createAction(LOGGED_IN);
const loggedOut = createAction(LOGGED_OUT);
const listedEndUsers = createAction(LISTED_END_USERS);
const listedAdminUsers = createAction(LISTED_ADMIN_USERS);
const listedUsersByRole = createAction(LISTED_USERS_BY_ROLE);

// --- saga

export const saga = [
  takeLatest(LOGIN_WITH_MOBILE_PHONE, sagaLoginWithMobilePhone),
  takeLatest(LOGIN_WITH_TOKEN, sagaLoginWithToken),
  takeLatest(LOGOUT, sagaLogout),

  takeLatest(LIST_END_USERS, sagaListEndUsers),
  takeLatest(LIST_ADMIN_USERS, sagaListAdminUsers),
  takeLatest(LIST_USERS_BY_ROLE, sagaListUsersByRole),
  takeLatest(CREATE_USER, sagaCreateUser),
  takeLatest(DELETE_USER, sagaDeleteUser),
  takeLatest(UPDATE_USER, sagaUpdateUser),
];

function* sagaLoginWithMobilePhone(action) {
  // payload = {
  //   phone,
  //   password,
  //   onSuccess?,
  //   onFailure?,
  //   onComplete?,
  // }
  const payload = action.payload;

  try {
    const params = {
    };

    ({
      phone: params.phone,
      password: params.password,
    } = payload);

    // result = {
    //   jsonCurUser,
    //   token,
    //   jsonCurRoleIds,
    //   jsonRoles,
    //   jsonPermissions,
    // }
    const login = yield call(api.loginWithMobilePhone, params);

    yield put(loggedIn({login}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }

    logger.info('login succeeded：', login);
  } catch (e) {
    if (payload.onFailure) {
      payload.onFailure();
    }

    logger.error('login failed：', e);
    logger.error('code: ', e.code);
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaLoginWithToken(action) {
  // payload = {
  //   token,
  //   onSuccess?,
  //   onFailure?,
  //   onComplete?,
  // }
  const payload = action.payload;

  try {
    const params = {
    };

    ({
      token: params.token,
    } = payload);

    // result = {
    //   jsonCurUser,
    //   token,
    //   jsonCurRoleIds,
    //   jsonRoles,
    //   jsonPermissions,
    // }
    const login = yield call(api.become, params);

    yield put(loggedIn({login}));

    if (payload.onSuccess) {
      payload.onSuccess();
    }

    logger.info('login with token succeeded：', login);
  } catch(e) {
    if (payload.onFailure) {
      payload.onFailure();
    }

    logger.error('login with token failed：', e);
    logger.error('code: ', e.code);
  }

  yield put(loaded({}));

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaLogout(action) {
  const payload = action.payload;

  try {
    const params = {
    };

    yield call(api.logout, params);

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

function* sagaListEndUsers(action) {
  // payload = {
  //   limit?,
  //   lastCreatedAt?,
  //   onSuccess?,
  //   onFailure?,
  //   onComplete?,
  // }
  const payload = action.payload;

  try {
    const params = {
      type: 'end',
    };

    ({
      limit: params.limit,
      lastCreatedAt: params.lastCreatedAt,
    } = payload);

    // result = {
    //   jsonUsers,
    // }
    const result = yield call(api.listUsers, params);

    const {jsonUsers} = result;
    yield put(listedEndUsers({
      jsonUsers
    }));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    logger.error('list end users failed：', e);
    logger.error('code: ', e.code);

    if (payload.onFailure) {
      payload.onFailure();
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaListAdminUsers(action) {
  // payload = {
  //   limit?,
  //   lastCreatedAt?,
  //   idName?,
  //   mobilePhoneNumber?,
  //   onSuccess?,
  //   onFailure?,
  //   onComplete?,
  // }
  const payload = action.payload;

  try {
    const params = {
      type: 'admin',
    };

    ({
      limit: params.limit,
      lastCreatedAt: params.lastCreatedAt,
      idName: params.idName,
      mobilePhoneNumber: params.mobilePhoneNumber,
    } = payload);

    // result = {
    //   jsonUsers,
    // }
    const result = yield call(api.listUsers, params);

    const {jsonUsers} = result;
    yield put(listedAdminUsers({
      jsonUsers
    }));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    logger.error('list admin users failed：', e);
    logger.error('code: ', e.code);

    if (payload.onFailure) {
      payload.onFailure();
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaListUsersByRole(action) {
  // payload = {
  //   limit?,
  //   lastCreatedAt?,
  //   roleId,
  //   onSuccess?,
  //   onFailure?,
  //   onComplete?,
  // }
  const payload = action.payload;

  try {
    const {roleCode} = payload;

    const role = yield select(selectRoleByCode, roleCode);

    const params = {
      type: 'admin',
      roleId: role.id,
    };

    ({
      limit: params.limit,
      lastCreatedAt: params.lastCreatedAt,
    } = payload);


    // result = {
    //   jsonUsers,
    // }
    const result = yield call(api.listUsers, params);

    const {jsonUsers} = result;
    yield put(listedUsersByRole({
      roleId: params.roleId,
      jsonUsers
    }));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    logger.error('list users by role failed：', e);
    logger.error('code: ', e.code);

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
    logger.error('create user failed：', e);
    logger.error('code: ', e.code);

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
    logger.error('delete user failed：', e);
    logger.error('code: ', e.code);

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
    logger.error('update user failed：', e);
    logger.error('code: ', e.code);

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
      return reduceLoggedIn(state, action);
    case LOGGED_OUT:
      return reduceLoggedOut(state, action);
    case LISTED_END_USERS:
      return reduceListedEndUsers(state, action);
    case LISTED_ADMIN_USERS:
      return reduceListedAdminUsers(state, action);
    case LISTED_USERS_BY_ROLE:
      return reduceListedUsersByRole(state, action);
    case REHYDRATE:
      return reduceRehydrate(state, action);
    case CACHED_USER:
      return reduceCachedUser(state, action);
    case CACHED_USERS:
      return reduceCachedUsers(state, action);
    default:
      return state
  }
}

function reduceLoaded(state, action) {
  return state.set('loading', false);
}

function reduceLoggedIn(state, action) {
  const {login} = action.payload;
  const {jsonCurUser, token, jsonCurRoleIds, jsonRoles, jsonPermissions} = login;

  // 'curRoleIds'
  const immCurRoleIds = new Set(jsonCurRoleIds);

  // since we login from client side, e.g., browser, the roles of the login user
  // were fetched separately
  const immCurUser = User.fromJson(jsonCurUser).set('roles', immCurRoleIds);

  // 'curPermissionIds'
  const immCurPermissionIds = new Set().withMutations((m) => {
    immCurRoleIds.forEach((i) => {
      const immRole = immRolesById.get(i);
      const immPermissionIds = immRole.get('permissions');
      m.union(immPermissionIds);
    });
  });

  // 'rolesById'
  const immRolesById = new Map().withMutations((m) => {
    jsonRoles.forEach((i) => {
      const immRole = Role.fromJson(i);
      m.set(immRole.id, immRole);
    });
  });

  // 'permissionsById'
  const immPermissionsById = new Map().withMutations((m) => {
    jsonPermissions.forEach((i) => {
      const immPermission = Permission.fromJson(i);
      m.set(immPermission.id, immPermission);
    });
  });

  return state.withMutations((m) => {
    m.set('token', token);
    m.set('curUserId', immCurUser.id);
    m.set('curRoleIds', immCurRoleIds);
    m.set('curPermissionIds', immCurPermissionIds);
    m.set('rolesById', immRolesById);
    m.set('permissionsById', immPermissionsById);
    m.setIn(['cachedUsersById', immCurUser.id], immCurUser);
  });
}

function reduceLoggedOut(state, action) {
  return state.withMutations((m) => {
    m.set('curUserId', undefined);
    m.set('token', undefined);
  });
}

function reduceListedEndUsers(state, action) {
  const {jsonUsers} = action.payload;

  const immUsers = [];
  const userIds = new Set();
  jsonUsers.forEach((i) => {
    const immUser = User.fromJson(i);
    immUsers.push(immUser);
    userIds.add(i.id);
  });

  return state.withMutations((m) => {
    m.set('endUsers', userIds);

    immUsers.forEach((i) => {
      m.setIn(['cachedUsersById', i.id], i);
    });
  });
}

function reduceListedAdminUsers(state, action) {
  const {jsonUsers} = action.payload;

  const immUsers = [];
  const userIds = new Set();
  jsonUsers.forEach((i) => {
    const immUser = User.fromJson(i);
    immUsers.push(immUser);
    userIds.add(i.id);
  });

  return state.withMutations((m) => {
    m.set('adminUsers', userIds);

    immUsers.forEach((i) => {
      m.setIn(['cachedUsersById', i.id], i);
    });
  });
}

function reduceListedUsersByRole(state, action) {

  const {roleCode, jsonUsers} = action.payload;

  // const userIds = new List().withMutations((m) => {
  //   jsonUsers.forEach((i) => {
  //     m.push(i.id);
  //   });
  // });

  const immUsers = [];
  const userIds = new Set();
  jsonUsers.forEach((i) => {
    const immUser = User.fromJson(i);
    immUsers.push(immUser);
    userIds.add(i.id);
  });

  return state.withMutations((m) => {
    m.setIn(['usersByRole', roleId], userIds);

    immUsers.forEach((i) => {
      m.setIn(['cachedUsersById', i.id], i);
    });
  });
}

function reduceRehydrate(state, action) {
  const storage = action.payload.AUTH;

  if (storage === undefined)
    return state;

  // all data in json format
  const {token, curUserId, curRoleIds, curPermissionIds, rolesById, permissionsById,
    endUsers, adminUsers, usersByRole, cachedUsersById} = storage;

  const immCurRoleIds = new Set(curRoleIds);
  const immCurPermissionIds = new Set(curPermissionIds);

  // 'rolesById'
  const immRolesById = new Map().withMutations((m) => {
    Object.values(rolesById).forEach((i) => {
      const immRole = Role.fromJson(i);
      m.set(immRole.id, immRole);
    });
  });

  // 'permissionsById'
  const immPermissionsById = new Map().withMutations((m) => {
    Object.values(permissionsById).forEach((i) => {
      const immPermission = Permission.fromJson(i);
      m.set(immPermission.id, immPermission);
    });
  });

  // 'endUsers'
  const immEndUsers = new Set(endUsers);

  // 'adminUsers'
  const immAdminUsers = new Set(adminUsers);

  // 'usersByRole'
  const immUsersByRole = new Map().withMutations((m) => {
    for (const [k, v] of Object.entries(usersByRole)) {
      m.set(k, new List(v));
    }
  });

  const immCachedUsersById = new Map().withMutations((m) => {
    Object.values(cachedUsersById).forEach((i) => {
      const immUser = User.fromJson(i);
      m.set(immUser.id, immUser);
    });
  });

  return state.withMutations((m) => {
    m.set('token', token);
    // m.set('curUserId', curUserId);   // always re-auth with the server
    m.set('curRoleIds', immCurRoleIds);
    m.set('curPermissionIds', immCurPermissionIds);
    m.set('rolesById', immRolesById);
    m.set('permissionsById', immPermissionsById);
    m.set('endUsers', immEndUsers);
    m.set('adminUsers', immAdminUsers);
    m.set('usersByRole', immUsersByRole);
    m.set('cachedUsersById', immCachedUsersById);
  });
}

function reduceCachedUser(state, action) {
  const {user} = action.payload;

  const immUser = User.fromJson(user);

  return state.setIn(['cachedUsersById', immUser.id], immUser);
}

function reduceCachedUsers(state, action) {
  const {users} = action.payload;

  const immUsers = [];
  users.forEach((i) => {
    const immUser = User.fromJson(i);
    immUsers.push(immUser);
  });

  return state.withMutations((m) => {
    immUsers.forEach((i) => {
      m.setIn(['cachedUsersById', i.id], i);
    });
  });
}

// --- selector

export const selector = {
  selectLoading,
  selectCurUserId,
  selectCurUser,
  selectToken,
  selectRoles,
  selectEndUsers,
  selectAdminUsers,
  selectUsersByRole,
  selectUserById,
  selectRolesByUser,
  selectPermissionsByUser,
};

function selectLoading(appState) {
  return appState.AUTH.loading;
}

function selectCurUserId(appState) {
  return appState.AUTH.curUserId;
}

function selectCurUser(appState) {
  const curUserId = selectCurUserId(appState);

  if (curUserId === undefined)
    return undefined;

  return selectUserById(appState, curUserId);
}

function selectToken(appState) {
  return appState.AUTH.token;
}

function selectRoles(appState) {
  const roles = [];

  const immRoles = appState.AUTH.getIn(['rolesById'], new Map()).toArray();
  immRoles.forEach((i) => {
    roles.push(Role.toJson(i));
  });

  return roles;
}

function selectEndUsers(appState) {
  const users = [];

  const immUsers = appState.AUTH.get('endUsers', new Set());

  immUsers.forEach((i) => {
    users.push(User.toJson(i));
  });

  return users;
}

function selectAdminUsers(appState) {
  const users = [];

  const immUsers = appState.AUTH.get('adminUsers', new Set());

  immUsers.forEach((i) => {
    users.push(User.toJson(i));
  });

  return users;
}

function selectUsersByRole(appState, roleId) {
  const users = [];

  const immUsers = appState.AUTH.getIn(['usersByRole', roleId], new Set());

  immUsers.forEach((i) => {
    users.push(User.toJson(i));
  });

  return users;
}

function selectUserById(appState, userId) {
  if(!userId){
    return undefined
  }

  const immUser = appState.AUTH.getIn(['cachedUsersById', userId], undefined);

  if (immUser === undefined)
    return undefined;

  return User.toJson(immUser);
}

function selectRolesByUser(appState, userId) {
  const immUser = appState.AUTH.getIn(['cachedUsersById', userId], undefined);

  if (immUser === undefined)
    return undefined;

  const immRoleIds = immUser.get('roles', new Set());

  return immRoleIds.toArray();
}

function selectPermissionsByUser(appState, userId) {
  const immUser = appState.AUTH.getIn(['cachedUsersById', userId], undefined);

  if (immUser === undefined)
    return undefined;

  const immRoleIds = immUser.get('roles', new Set());

  const immPermissionIds = new Set().withMutations((m) => {
    const immRolesById = appState.AUTH.get('rolesById', new Map());

    immRoleIds.forEach((i) => {
      const immRole = immRolesById.get(i);
      const immPermissionIds = immRole.get('permissions');
      m.union(immPermissionIds);
    });
  });

  return immPermissionIds.toArray();
}
