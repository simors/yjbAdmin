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
  token: undefined,             // current login user token
  curUserId: undefined,         // current login user
  curRoleIds: Set(),            // Set<role id>
  curPermissionIds: Set(),      // Set<permission id>

  rolesById: Map(),             // Map<role id, Role>
  permissionsById: Map(),       // Map<permission id, Permission>

  rolesByCode: Map(),           // Map<role code, Role>
  permissionsByCode: Map(),     // Map<permission code, Permission>

  endUsers: List(),             // List<user id>
  adminUsers: List(),           // List<user id>
  adminRoles: Map(),            // Map<user id, Set<role code>>

  usersByRole: Map(),           // Map<role code, List<user id>>
  usersById: Map(),             // Map<user id, User>
}, 'AuthState') {

}

// --- constant

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

export const action = {
  loginWithMobilePhone: createAction(LOGIN_WITH_MOBILE_PHONE),
  loginWithToken: createAction(LOGIN_WITH_TOKEN),
  logout: createAction(LOGOUT),
  listEndUsers: createAction(LIST_END_USERS),
  listAdminUsers: createAction(LIST_ADMIN_USERS),
  listUsersByRole: createAction(LIST_USERS_BY_ROLE),

  createUser: createAction(CREATE_USER),
  deleteUser: createAction(DELETE_USER),
  updateUser: createAction(UPDATE_USER),

  saveUser: createAction(CACHED_USER),
  saveUsers: createAction(CACHED_USERS),
};

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

/**
 *
 * @param action
 * payload = {
 *   phone,
 *   password,
 *   onSuccess?,
 *   onFailure?,
 *   onComplete?,
 * }
 */
function* sagaLoginWithMobilePhone(action) {
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

/**
 *
 * @param action
 * payload = {
 *   token,
 *   onSuccess?,
 *   onFailure?,
 *   onComplete?,
 * }
 */
function* sagaLoginWithToken(action) {
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

/**
 *
 * @param action
 * payload = {
 *   limit?,
 *   lastCreatedAt?,
 *   onSuccess?,
 *   onFailure?,
 *   onComplete?,
 * }
 */
function* sagaListEndUsers(action) {
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

/**
 *
 * @param action
 * payload = {
 *   limit?,
 *   lastCreatedAt?,
 *   idName?,
 *   mobilePhoneNumber?,
 *   onSuccess?,
 *   onFailure?,
 *   onComplete?,
 * }
 */
function* sagaListAdminUsers(action) {
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

/**
 * List admin users by role code.
 * @param action
 * payload = {
 *   limit?,
 *   lastCreatedAt?,
 *   roleCode,
 *   onSuccess?,
 *   onFailure?,
 *   onComplete?,
 * }
 */
function* sagaListUsersByRole(action) {
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
      roleCode,
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

  // 'rolesByCode'
  const immRolesByCode = new Map().withMutations((m) => {
    jsonRoles.forEach((i) => {
      const immRole = Role.fromJson(i);
      m.set(immRole.code, immRole);
    });
  });

  // 'permissionsByCode'
  const immPermissionsByCode = new Map().withMutations((m) => {
    jsonPermissions.forEach((i) => {
      const immPermission = Permission.fromJson(i);
      m.set(immPermission.code, immPermission);
    });
  });

  return state.withMutations((m) => {
    m.set('token', token);
    m.set('curUserId', immCurUser.id);
    m.set('curRoleIds', immCurRoleIds);
    m.set('curPermissionIds', immCurPermissionIds);
    m.set('rolesById', immRolesById);
    m.set('permissionsById', immPermissionsById);
    m.set('rolesByCode', immRolesByCode);
    m.set('permissionsByCode', immPermissionsByCode);
    m.setIn(['usersById', immCurUser.id], immCurUser);
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

  return state.withMutations((m) => {
    const userIds = [];

    jsonUsers.forEach((i) => {
      userIds.push(i.id);

      const immUser = User.fromJson(i);
      m.setIn(['usersById', i.id], immUser);
    });

    m.set('endUsers', new List(userIds));
  });
}

function reduceListedAdminUsers(state, action) {
  const {jsonUsers} = action.payload;

  return state.withMutations((m) => {
    const userIds = [];

    jsonUsers.forEach((i) => {
      userIds.push(i.id);

      // admin users has role(s) associated with them
      const {roles} = i;
      m.setIn(['adminRoles', i.id], new Set(roles));

      const immUser = User.fromJson(i);
      m.setIn(['usersById', i.id], immUser);
    });

    m.set('adminUsers', new List(userIds));
  });
}

function reduceListedUsersByRole(state, action) {
  const {roleCode, jsonUsers} = action.payload;

  return state.withMutations((m) => {
    const userIds = [];

    jsonUsers.forEach((i) => {
      userIds.push(i.id);

      const immUser = User.fromJson(i);
      m.setIn(['usersById', i.id], immUser);
    });

    m.setIn(['usersByRole', roleCode], userIds);
  });
}

function reduceRehydrate(state, action) {
  const storage = action.payload.AUTH;

  if (storage === undefined)
    return state;

  // TODO: to do rehydrate later

  const {token} = storage;
  return state.withMutations((m) => {
    m.set('token', token);
  });

  // all data in json format
  const {curUserId, curRoleIds, curPermissionIds,
    rolesByCode, permissionsByCode, rolesById, permissionsById,
    endUsers, adminUsers, usersByRole, usersById} = storage;

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

  // 'rolesByCode'
  const immRolesByCode = new Map().withMutations((m) => {
    Object.values(rolesByCode).forEach((i) => {
      const immRole = Role.fromJson(i);
      m.set(immRole.code, immRole);
    });
  });

  // 'permissionsByCode'
  const immPermissionsByCode = new Map().withMutations((m) => {
    Object.values(permissionsByCode).forEach((i) => {
      const immPermission = Permission.fromJson(i);
      m.set(immPermission.code, immPermission);
    });
  });

  // 'endUsers'
  const immEndUsers = new List(endUsers);

  // 'adminUsers'
  const immAdminUsers = new List(adminUsers);

  // 'usersByRole'
  const immUsersByRole = new Map().withMutations((m) => {
    for (const [k, v] of Object.entries(usersByRole)) {
      m.set(k, new List(v));
    }
  });

  const immUsersById = new Map().withMutations((m) => {
    Object.values(usersById).forEach((i) => {
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
    m.set('rolesByCode', immRolesByCode);
    m.set('permissionsByCode', immPermissionsByCode);
    m.set('endUsers', immEndUsers);
    m.set('adminUsers', immAdminUsers);
    m.set('usersByRole', immUsersByRole);
    m.set('usersById', immUsersById);
  });
}

/**
 *
 * @param state
 * @param action
 * payload = {
 *   user: User,
 * }
 */
function reduceCachedUser(state, action) {
  const {user} = action.payload;

  const immUser = User.fromJson(user);

  return state.setIn(['usersById', immUser.id], immUser);
}

/**
 *
 * @param state
 * @param action
 * payload = {
 *   users: Array<User>,
 * }
 */
function reduceCachedUsers(state, action) {
  const {users} = action.payload;

  const immUsers = [];
  users.forEach((i) => {
    const immUser = User.fromJson(i);
    immUsers.push(immUser);
  });

  return state.withMutations((m) => {
    immUsers.forEach((i) => {
      m.setIn(['usersById', i.id], i);
    });
  });
}

// --- selector

export const selector = {
  selectCurUserId,
  selectCurUser,
  selectToken,
  selectRoles,
  selectEndUsers,
  selectAdminUsers,
  selectUserById,
  selectUsersByRole,
  selectRolesByUser,
  selectPermissionsByUser,
};

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

  const immRoles = appState.AUTH.getIn(['rolesByCode'], new Map()).toArray();
  immRoles.forEach((i) => {
    roles.push(Role.toJson(i));
  });

  return roles;
}

function selectRoleByCode(appState, roleCode) {
  const immRole = appState.AUTH.getIn(['rolesByCode', roleCode]);

  return Role.toJson(immRole);
}

function selectEndUsers(appState) {
  const users = [];

  const userIds = appState.AUTH.get('endUsers', new List());

  userIds.forEach((i) => {
    users.push(selectUserById(i));
  });

  return users;
}

function selectAdminUsers(appState) {
  const users = [];

  const userIds = appState.AUTH.get('adminUsers', new List());

  userIds.forEach((i) => {
    users.push(selectUserById(appState, i));
  });

  return users;
}

/**
 * Get user detail by user id.
 * @param {Object} appState
 * @param {String} userId
 * @returns {User} User object
 */
function selectUserById(appState, userId) {
  if(!userId){
    return undefined
  }

  const immUser = appState.AUTH.getIn(['usersById', userId]);
  if (immUser === undefined)
    return undefined;

  return User.toJson(immUser);
}

/**
 * Get all users with the specified role code.
 * @param {Object} appState
 * @param {Number} roleCode
 * @returns {Array} an array of User object
 */
function selectUsersByRole(appState, roleCode) {
  const users = [];

  const userIds = appState.AUTH.getIn(['usersByRole', roleCode], new List());

  userIds.forEach((i) => {
    users.push(selectUserById(appState, i));
  });

  return users;
}

/**
 * Get user's role codes by user id.
 * @param {Object} appState
 * @param {String} userId
 * @returns {Array} an array of role code
 */
function selectRolesByUser(appState, userId) {
  // Map<user id, User>
  const immUser = appState.AUTH.getIn(['usersById', userId]);
  if (immUser === undefined)
    return undefined;

  const roleCodes = [];

  // Map<role id, Role>
  const immRolesById = appState.AUTH.getIn(['rolesById']);

  const immRoleIds = immUser.get('roles', new Set());
  // convert roleId to roleCode
  immRoleIds.forEach((i) => {
    const immRole = immRolesById.get(i);

    roleCodes.push(immRole.get('code'));
  });

  return roleCodes;
}

/**
 * Get user's permission codes by user id.
 * @param {Object} appState
 * @param {String} userId
 * @returns {Array} an array of permission code
 */
function selectPermissionsByUser(appState, userId) {
  // Map<user id, User>
  const immUser = appState.AUTH.getIn(['usersById', userId]);
  if (immUser === undefined)
    return undefined;

  const permissionCodes = [];

  const immPermissionIds = new Set().withMutations((m) => {
    // Map<role id, Role>
    const immRolesById = appState.AUTH.getIn(['rolesById']);

    const immRoleIds = immUser.get('roles', new Set());
    immRoleIds.forEach((i) => {
      const immRole = immRolesById.get(i);

      const immPermissionIdsPerRole = immRole.get('permissions');
      m.union(immPermissionIdsPerRole);
    });
  });

  // Map<permission id, Permission>
  const immPermissionsById = appState.AUTH.getIn(['permissionsById']);

  // convert permissionId to permissionCode
  immPermissionIds.forEach((i) => {
    const immPermission = immPermissionsById.get(i);

    permissionCodes.push(immPermission.get('code'));
  });

  return permissionCodes;
}
