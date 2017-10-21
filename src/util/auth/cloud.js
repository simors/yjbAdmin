import AV from 'leancloud-storage';

export async function loginWithMobilePhone(payload) {
  const {phone, password} = payload;

  const leanCurUser = await AV.User.logInWithMobilePhone(phone, password);
  const token = leanCurUser.getSessionToken();

  // result = {
  //   jsonCurRoleCodes,
  //   jsonRoles,
  //   jsonPermissions,
  // }
  const result = await AV.Cloud.run('authGetRolesAndPermissions', {});

  // result = {
  //   jsonCurUser,
  //   token,
  //   jsonCurRoleCodes,
  //   jsonRoles,
  //   jsonPermissions,
  // }
  return ({
    jsonCurUser: {
      ...leanCurUser.toJSON(),
      id: leanCurUser.id,
    },
    token,
    ...result,
  });
}

export async function become(payload) {
  const {token: oldToken} = payload;

  const leanCurUser = await AV.User.become(oldToken);
  const token = leanCurUser.getSessionToken();

  // result = {
  //   jsonCurRoleCodes,
  //   jsonRoles,
  //   jsonPermissions,
  // }
  const result = await AV.Cloud.run('authGetRolesAndPermissions', {});

  // result = {
  //   jsonCurUser,
  //   token,
  //   jsonCurRoleCodes,
  //   jsonRoles,
  //   jsonPermissions,
  // }
  return ({
    jsonCurUser: {
      ...leanCurUser.toJSON(),
      id: leanCurUser.id,
    },
    token,
    ...result,
  });
}

export async function logout(payload) {
  await AV.User.logOut();
}

/**
 *
 * @param payload
 * @returns {Promise.<object>}
 * {
 *   count,
 *   jsonUsers
 * }
 */
export async function listEndUsers(payload) {
  return await AV.Cloud.run('authListEndUsers', payload);
}

/**
 *
 * @param payload
 * @returns {Promise.<object>}
 * {
 *   jsonUsers
 * }
 */
export async function listUsers(payload) {
  return await AV.Cloud.run('authListUsers', payload);
}

/**
 *
 * @param payload
 * @returns {Promise.<*>}
 * {
 * }
 */
export async function createUser(payload) {
  return await AV.Cloud.run('authCreateUser', payload);
}

/**
 *
 * @param payload
 * @returns {Promise.<*>}
 * {
 * }
 */
export async function deleteUser(payload) {
  return await AV.Cloud.run('authDeleteUser', payload);
}

/**
 *
 * @param payload
 * @returns {Promise.<*>}
 * {
 * }
 */
export async function updateUser(payload) {
  return await AV.Cloud.run('authUpdateUser', payload);
}


/**
 *
 * @param payload smsAuthCode,phone
 * @returns {*}
 */
export async function verifySmsCode(payload) {
  let {smsCode, phone} = payload
  console.log('payload======>',payload)
  return await AV.Cloud.verifySmsCode(smsCode, phone)
}

/**
 *
 * @param payload phone,name,op
 * @returns {*}
 */
export async function requestSmsAuthCode(payload) {
  payload.ttl = 10
  console.log('payload======>',payload)
  return await AV.Cloud.requestSmsCode(payload)
}