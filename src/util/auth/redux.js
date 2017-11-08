import {call, put, takeLatest} from 'redux-saga/effects';
import {createAction} from 'redux-actions';
import {Record, Map, Set, List} from 'immutable';
import {REHYDRATE} from 'redux-persist/constants';
import {ROLE_CODE} from '../../util/rolePermission/';
import * as api from './cloud';

// --- model

class User extends Record({
  id: undefined,                  // objectId
  mpStatus: undefined,            // wechat user status, AUTH_USER_STATUS.MP_XXX
  status: undefined,              // admin user status, AUTH_USER_STATUS.ADMIN_XXX
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
  type: undefined,                // AUTH_USER_TYPE.XXX
  note: undefined,                // note for this user
  subscribe: undefined,
  roles: Set(),                   // Set<role code>
}, 'User') {
  static fromJson(json) {
    const imm = new User();

    return imm.withMutations((m) => {
      m.set('id', json.id);
      m.set('mpStatus', json.mpStatus);
      m.set('status', json.status);
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
      m.set('note', json.note);
      m.set('subscribe', json.subscribe);
      m.set('roles', new Set(json.roles));
    });
  }

  static toJson(imm) {
    // NOTE: IE8 does not support property access. Only use get() when supporting IE8
    return {
      id: imm.id,
      mpStatus: imm.mpStatus,
      status: imm.status,
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

  curRoles: Set(),              // Set<role code>
  curPermissions: Set(),        // Set<permission code>

  roles: Map(),                 // Map<role code, Role>
  permissions: Map(),           // Map<permission code, Permission>

  endUsers: List(),             // List<user id>
  adminUsers: List(),           // List<user id>
  sysAdminUsers: List(),        // List<user id>
  adminsByRole: Map(),          // Map<role code, List<user id>>

  usersById: Map(),             // Map<user id, User>

  adminQrcode: Map(),           // Map<phone, qrcode> save admin user mp qrcode
}, 'AuthState') {

}

// --- enum

export const AUTH_USER_TYPE = {
  END:      1,
  ADMIN:    2,
  BOTH:     3,
};

export const AUTH_USER_STATUS = {
  MP_NORMAL:      1,
  MP_DISABLED:    2,
  MP_ALL:         100,

  ADMIN_NORMAL:   101,
  ADMIN_DISABLED: 102,
  ADMIN_ALL:      200,
};

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
const LIST_SYS_ADMIN_USERS = 'AUTH/LIST_SYS_ADMIN_USERS';
const LISTED_SYS_ADMIN_USERS = 'AUTH/LISTED_SYS_ADMIN_USERS';
const LIST_ADMINS_BY_ROLE = 'AUTH/LIST_ADMINS_BY_ROLE';
const LISTED_ADMINS_BY_ROLE = 'AUTH/LISTED_ADMINS_BY_ROLE';
const FETCH_USER_BY_PHONE = 'AUTH/FETCH_USER_BY_PHONE';
const CREATE_USER = 'AUTH/CREATE_USER';
const DELETE_USER = 'AUTH/DELETE_USER';
const UPDATE_USER = 'AUTH/UPDATE_USER';

const SAVE_USER = 'AUTH/SAVE_USER';
const SAVE_USERS = 'AUTH/SAVE_USERS';

const REQUEST_SMS_CODE = 'AUTH/REQUEST_SMS_CODE'
const VERIFY_SMS_CODE = 'AUTH/FETCH_SMS_CODE'

const REQUEST_SYS_AUTH_CODE = 'AUTH/REQUEST_SYS_AUTH_CODE'
const VERIFY_SYS_AUTH_CODE = 'AUTH/VERIFY_SYS_AUTH_CODE'

const GENERATE_ADMIN_QRCODE       = 'GENERATE_ADMIN_QRCODE'
const SAVE_ADMIN_QRCODE           = 'SAVE_ADMIN_QRCODE'

// --- action

export const action = {
  loginWithMobilePhone: createAction(LOGIN_WITH_MOBILE_PHONE),
  loginWithToken: createAction(LOGIN_WITH_TOKEN),
  logout: createAction(LOGOUT),
  listEndUsers: createAction(LIST_END_USERS),
  listAdminUsers: createAction(LIST_ADMIN_USERS),
  listSysAdminUsers: createAction(LIST_SYS_ADMIN_USERS),
  listUsersByRole: createAction(LIST_ADMINS_BY_ROLE),
  fetchUserByPhone: createAction(FETCH_USER_BY_PHONE),

  createUser: createAction(CREATE_USER),
  deleteUser: createAction(DELETE_USER),
  updateUser: createAction(UPDATE_USER),

  saveUser: createAction(SAVE_USER),
  saveUsers: createAction(SAVE_USERS),

  requestSmsCode: createAction(REQUEST_SMS_CODE),
  verifySmsCode: createAction(VERIFY_SMS_CODE),

  requestSysAuthCode: createAction(REQUEST_SYS_AUTH_CODE),
  verifySysAuthCode: createAction(VERIFY_SYS_AUTH_CODE),

  generateAdminQrcode: createAction(GENERATE_ADMIN_QRCODE),
};

const loggedIn = createAction(LOGGED_IN);
const loggedOut = createAction(LOGGED_OUT);
const listedEndUsers = createAction(LISTED_END_USERS);
const listedAdminUsers = createAction(LISTED_ADMIN_USERS);
const listedSysAdminUsers = createAction(LISTED_SYS_ADMIN_USERS);
const listedAdminsByRole = createAction(LISTED_ADMINS_BY_ROLE);
const saveAdminQrcode = createAction(SAVE_ADMIN_QRCODE);

// --- saga

export const saga = [
  takeLatest(LOGIN_WITH_MOBILE_PHONE, sagaLoginWithMobilePhone),
  takeLatest(LOGIN_WITH_TOKEN, sagaLoginWithToken),
  takeLatest(LOGOUT, sagaLogout),

  takeLatest(LIST_END_USERS, sagaListEndUsers),
  takeLatest(LIST_ADMIN_USERS, sagaListAdminUsers),
  takeLatest(LIST_SYS_ADMIN_USERS, sagaListSysAdminUsers),
  takeLatest(LIST_ADMINS_BY_ROLE, sagaListAdminsByRole),
  takeLatest(FETCH_USER_BY_PHONE, sagaFetchUserByPhone),
  takeLatest(CREATE_USER, sagaCreateUser),
  takeLatest(DELETE_USER, sagaDeleteUser),
  takeLatest(UPDATE_USER, sagaUpdateUser),
  takeLatest(REQUEST_SMS_CODE, sagaRequestSmsCode),
  takeLatest(VERIFY_SMS_CODE, sagaVerifySmsCode),
  takeLatest(REQUEST_SYS_AUTH_CODE, sagaReqSysAuthCode),
  takeLatest(VERIFY_SYS_AUTH_CODE, sagaVerifyAuthCode),
  takeLatest(GENERATE_ADMIN_QRCODE, sagaGenerateUserQrcode),
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
      payload.onFailure(e.code);
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
      payload.onFailure(e.code);
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
      payload.onFailure(e.code);
    }
  }

  yield put(loggedOut({}));

  if (payload.onComplete) {
    payload.onComplete();
  }
}

/**
 * List end users.
 * @param action
 * payload = {
 *   skip?,
 *   limit?,
 *   mobilePhoneNumber?: string,
 *   province?: string,
 *   city?: string,
 *   mpStatus?: number,
 *   onSuccess?,
 *   onFailure?,
 *   onComplete?,
 * }
 */
function* sagaListEndUsers(action) {
  const payload = action.payload;

  try {
    const params = {
    };

    ({
      skip: params.skip,
      limit: params.limit,
      mobilePhoneNumber: params.mobilePhoneNumber,
      province: params.province,
      city: params.city,
      mpStatus: params.mpStatus,
    } = payload);

    // result = {
    //   count,
    //   jsonUsers,
    // }
    const result = yield call(api.listEndUsers, params);

    const {count, jsonUsers} = result;
    yield put(listedEndUsers({
      count,
      jsonUsers
    }));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    logger.error('list end users failed：', e);
    logger.error('code: ', e.code);

    if (payload.onFailure) {
      payload.onFailure(e.code);
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

/**
 * List admin users.
 * @param action
 * payload = {
 *   skip?: number,
 *   limit?: number,
 *   nickname?: string,
 *   mobilePhoneNumber?: string,
 *   roles?: Array<number>, an array of role codes, e.g., [100, 200]
 *   status?: number,
 *   onSuccess?,
 *   onFailure?,
 *   onComplete?,
 * }
 */
function* sagaListAdminUsers(action) {
  const payload = action.payload;

  try {
    const params = {
    };

    ({
      skip: params.skip,
      limit: params.limit,
      nickname: params.nickname,
      mobilePhoneNumber: params.mobilePhoneNumber,
      roles: params.roles,
      status: params.status,
      skipMyself: params.skipMyself,
    } = payload);

    // result = {
    //   count,
    //   jsonUsers,
    // }
    const result = yield call(api.listAdminUsers, params);

    const {count, jsonUsers} = result;
    yield put(listedAdminUsers({
      count,
      jsonUsers
    }));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    logger.error('list admin users failed：', e);
    logger.error('code: ', e.code);

    if (payload.onFailure) {
      payload.onFailure(e.code);
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

/**
 * List system admin users.
 * @param action
 * payload = {
 *   limit?: number,
 *   nickname?: string,
 *   mobilePhoneNumber?: string,
 *   status?: number,
 *   onSuccess?,
 *   onFailure?,
 *   onComplete?,
 * }
 */
function* sagaListSysAdminUsers(action) {
  const payload = action.payload;

  try {
    const params = {
    };

    ({
      limit: params.limit,
      nickname: params.nickname,
      mobilePhoneNumber: params.mobilePhoneNumber,
      status: params.status,
    } = payload);

    // result = {
    //   jsonUsers,
    // }
    const result = yield call(api.listSysAdminUsers, params);

    const {jsonUsers} = result;
    yield put(listedSysAdminUsers({
      jsonUsers
    }));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    logger.error('list system admin users failed：', e);
    logger.error('code: ', e.code);

    if (payload.onFailure) {
      payload.onFailure(e.code);
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

/**
 * List admin users by specified roles.
 * @param action
 * payload = {
 *   skip?: number,
 *   limit?: number,
 *   nickname?: string,
 *   mobilePhoneNumber?: string,
 *   role?: number, role code
 *   status?: number
 *   onSuccess?,
 *   onFailure?,
 *   onComplete?,
 * }
 */
function* sagaListAdminsByRole(action) {
  const payload = action.payload;

  try {
    const params = {
    };

    ({
      skip: params.skip,
      limit: params.limit,
      idName: params.idName,
      mobilePhoneNumber: params.mobilePhoneNumber,
      status: params.status,
    } = payload);

    const {roleCode: role} = payload;
    params.roles = [role];

    // result = {
    //   count,
    //   jsonUsers,
    // }
    const result = yield call(api.listAdminUsers, params);

    const {count, jsonUsers} = result;
    yield put(listedAdminsByRole({
      role,
      count,
      jsonUsers
    }));

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    logger.error('list admin users by role failed：', e);
    logger.error('code: ', e.code);

    if (payload.onFailure) {
      payload.onFailure(e.code);
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaFetchUserByPhone(action) {
  let payload = action.payload
  try {
    let user = yield call(api.fetchUserByPhone, payload)
    if (payload.onSuccess) {
      payload.onSuccess(user);
    }
  } catch (e) {
    if (payload.onFailure) {
      payload.onFailure(e.code);
    }
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
      payload.onFailure(e.code);
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
      payload.onFailure(e.code);
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
      payload.onFailure(e.code);
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaRequestSmsCode(action) {
  const payload = action.payload
  try{
    yield call(api.requestSmsAuthCode, payload)
    if(payload.success){
      payload.success()
    }
  }catch(e){
    console.log(e)
    if(payload.error){
      payload.error(e)
    }
  }
}

/**
 *
 * @param action
 * {
 *  smsCode, phone
 * }
 */
function* sagaVerifySmsCode(action) {
  const payload = action.payload
  try{
    yield call(api.verifySmsCode, payload)
    if(payload.success){
      payload.success()
    }
  }catch(e){
    if(payload.error){
      payload.error(e)
    }
  }
}

function *sagaGenerateUserQrcode(action) {
  let payload = action.payload
  try {
    let qrcodeUrl = yield call(api.requestGenerateUserQrcode, payload)
    yield put(saveAdminQrcode({phone: payload.phone, qrcode: qrcodeUrl}))
    if(payload.success){
      payload.success()
    }
  } catch (e) {
    if(payload.error){
      payload.error(e)
    }
  }
}

function* sagaReqSysAuthCode(action) {
  let payload = action.payload
  try {
    let result = yield call(api.requestSysAuthCode, payload)
    if(payload.success){
      payload.success(result)
    }
  } catch (e) {
    if(payload.error){
      payload.error(e)
    }
  }
}

function* sagaVerifyAuthCode(action) {
  let payload = action.payload
  try {
    let result = yield call(api.verifySysAuthCode, payload)
    if (result) {
      if(payload.success){
        payload.success(result)
      }
    } else {
      if(payload.error){
        payload.error()
      }
    }
  } catch (e) {
    if(payload.error){
      payload.error(e)
    }
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
    case LISTED_SYS_ADMIN_USERS:
      return reduceListedSysAdminUsers(state, action);
    case LISTED_ADMINS_BY_ROLE:
      return reduceListedAdminsByRole(state, action);
    case REHYDRATE:
      return reduceRehydrate(state, action);
    case SAVE_USER:
      return reduceSaveUser(state, action);
    case SAVE_USERS:
      return reduceSaveUsers(state, action);
    case SAVE_ADMIN_QRCODE:
      return reduceSaveAdminQrcode(state, action)
    default:
      return state
  }
}

function reduceLoggedIn(state, action) {
  const {login} = action.payload;
  const {token, jsonCurUser, jsonRoles, jsonPermissions} = login;

  const immCurUser = User.fromJson(jsonCurUser);

  const immCurRoles = immCurUser.get('roles', new Set());

  // 'roles'
  const immRoles = new Map().withMutations((m) => {
    jsonRoles.forEach((i) => {
      const immRole = Role.fromJson(i);
      m.set(immRole.code, immRole);
    });
  });

  // 'permissions'
  const immPermissions = new Map().withMutations((m) => {
    jsonPermissions.forEach((i) => {
      const immPermission = Permission.fromJson(i);
      m.set(immPermission.code, immPermission);
    });
  });

  // 'curPermissionCodes'
  const immCurPermissions = new Set().withMutations((m) => {
    immCurRoles.forEach((i) => {
      const immRole = immRoles.get(i);
      const immPermissionCodes = immRole.get('permissions');
      m.union(immPermissionCodes);
    });
  });

  return state.withMutations((m) => {
    m.set('curUserId', immCurUser.id);
    m.set('token', token);
    m.set('curRoles', immCurRoles);
    m.set('curPermissions', immCurPermissions);
    m.set('roles', immRoles);
    m.set('permissions', immPermissions);
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
  const {count, jsonUsers} = action.payload;

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
  const {count, jsonUsers} = action.payload;

  return state.withMutations((m) => {
    const userIds = [];

    jsonUsers.forEach((i) => {
      userIds.push(i.id);

      const immUser = User.fromJson(i);
      m.setIn(['usersById', i.id], immUser);
    });

    m.set('adminUsers', new List(userIds));
  });
}

function reduceListedSysAdminUsers(state, action) {
  const {jsonUsers} = action.payload;

  return state.withMutations((m) => {
    const userIds = [];

    jsonUsers.forEach((i) => {
      userIds.push(i.id);

      const immUser = User.fromJson(i);
      m.setIn(['usersById', i.id], immUser);
    });

    m.set('sysAdminUsers', new List(userIds));
  });
}

function reduceListedAdminsByRole(state, action) {
  const {role, count, jsonUsers} = action.payload;

  return state.withMutations((m) => {
    const userIds = [];

    jsonUsers.forEach((i) => {
      userIds.push(i.id);

      const immUser = User.fromJson(i);
      m.setIn(['usersById', i.id], immUser);
    });

    m.setIn(['adminsByRole', role], userIds);
  });
}

function reduceRehydrate(state, action) {
  const storage = action.payload.AUTH;

  if (storage === undefined)
    return state;

  // all data in json format
  const {token, curRoleCodes, curPermissionCodes,
    roles, permissions, endUsers, adminUsers, sysAdminUsers,
    adminsByRole, usersById} = storage;

  const immCurRoles = new Set(curRoleCodes);
  const immCurPermissions = new Set(curPermissionCodes);

  // 'roles'
  const immRoles = new Map().withMutations((m) => {
    Object.values(roles).forEach((i) => {
      const immRole = Role.fromJson(i);
      m.set(immRole.code, immRole);
    });
  });

  // 'permissions'
  const immPermissions = new Map().withMutations((m) => {
    Object.values(permissions).forEach((i) => {
      const immPermission = Permission.fromJson(i);
      m.set(immPermission.code, immPermission);
    });
  });

  // 'endUsers'
  const immEndUsers = new List(endUsers);

  // 'adminUsers'
  const immAdminUsers = new List(adminUsers);

  // 'sysAdminUsers'
  const immSysAdminUsers = new List(sysAdminUsers);

  // 'adminsByRole'
  const immUsersByRole = new Map().withMutations((m) => {
    for (const [k, v] of Object.entries(adminsByRole)) {
      m.set(k, new List(v));
    }
  });

  // 'usersById'
  const immUsersById = new Map().withMutations((m) => {
    Object.values(usersById).forEach((i) => {
      const immUser = User.fromJson(i);
      m.set(immUser.id, immUser);
    });
  });

  return state.withMutations((m) => {
    m.set('token', token);
    m.set('curRoles', immCurRoles);
    m.set('curPermissions', immCurPermissions);
    m.set('roles', immRoles);
    m.set('permissions', immPermissions);
    m.set('endUsers', immEndUsers);
    m.set('adminUsers', immAdminUsers);
    m.set('sysAdminUsers', immSysAdminUsers);
    m.set('adminsByRole', immUsersByRole);
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
function reduceSaveUser(state, action) {
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
function reduceSaveUsers(state, action) {
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

function reduceSaveAdminQrcode(state, action) {
  let payload = action.payload
  return state.setIn(['adminQrcode', payload.phone], payload.qrcode)
}

// --- selector

export const selector = {
  selectCurUser,
  selectToken,
  selectRoles,
  selectEndUsers,
  selectUserRoleName,
  selectAdminUsers,
  selectSysAdminUsers,
  selectUserById,
  selectCurAdminUser,
  selectUsersByRole,
  selectValidRoles,
  selectValidPermissions,
  selectAdminQrcode,
};

function selectCurUser(appState) {
  const curUserId = appState.AUTH.curUserId;
  if (curUserId === undefined)
    return undefined;

  return selectUserById(appState, curUserId);
}

function selectToken(appState) {
  return appState.AUTH.token;
}

function selectRoles(appState) {
  const roles = [];

  const immRoles = appState.AUTH.getIn(['roles'], new Map()).toArray();
  immRoles.forEach((i) => {
    if (i.code !== ROLE_CODE.SYS_MANAGER)  // skip system admin
      roles.push(Role.toJson(i));
  });

  return roles;
}

function selectEndUsers(appState) {
  const users = [];

  const userIds = appState.AUTH.get('endUsers', new List());

  userIds.forEach((i) => {
    users.push(selectUserById(appState, i));
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

function selectSysAdminUsers(appState) {
  const users = [];

  const userIds = appState.AUTH.get('sysAdminUsers', new List());
  userIds.forEach((i) => {
    users.push(selectUserById(appState, i));
  });

  return users;
}

/**
 * Get user detail by user id.
 * @param {Object} appState
 * @param {String} userId
 * @returns {User} JSON representation of User object
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
 *
 * @param appState
 * @param roleCodes
 */
function selectUserRoleName(appState, roleCodes) {
  let roleNames = []
  for (let roleCode of roleCodes) {
    let role = appState.AUTH.getIn(['roles', roleCode])
    if (!role) {
      continue
    }
    let roleJs = role.toJS()
    roleNames.push(roleJs.displayName)
  }
  return roleNames
}

/**
 * Get current login admin user info
 * @param appState
 * @returns {*} JSON representation of User object with roles
 */
function selectCurAdminUser(appState) {
  const curUserId = appState.AUTH.curUserId;
  if (curUserId === undefined)
    return undefined;
  return selectUserById(appState, curUserId)
}

/**
 * Get all users with the specified role code.
 * @param {Object} appState
 * @param {Number} roleCode
 * @returns {Array} an array of User object
 */
function selectUsersByRole(appState, roleCode) {
  const users = [];

  const userIds = appState.AUTH.getIn(['adminsByRole', roleCode], new List());

  userIds.forEach((i) => {
    users.push(selectUserById(appState, i));
  });

  return users;
}

/**
 * Test if current login user belongs to one of the provided roles.
 * @param {Object} appState
 * @param {Array} roleCodes, e.g., [100, 200]
 * @returns {Boolean}
 */
function selectValidRoles(appState, roleCodes) {
  const curRoles = appState.AUTH.get('curRoles', new Set());

  return curRoles.intersect(new Set(roleCodes)).size > 0;
}

/**
 * Test if current login user has one of the provided permissions.
 * @param {Object} appState
 * @param {Array} permissionCodes, e.g., [1000, 1002]
 * @returns {Boolean}
 */
function selectValidPermissions(appState, permissionCodes) {
  const curPermissions = appState.AUTH.get('curPermissions', new Set());
  return curPermissions.intersect(new Set(permissionCodes)).size > 0;
}

/**
 * Get saved admin user qrcode by user phone number
 * @param state
 * @param phone
 * @returns {*|any}
 */
function selectAdminQrcode(state, phone) {
  let qrcode = state.AUTH.getIn(['adminQrcode', phone])
  return qrcode
}
