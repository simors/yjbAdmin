import AV from 'leancloud-storage';

export async function loginWithMobilePhone(payload) {
  const {phone, password} = payload;

  const leanCurUser = await AV.User.logInWithMobilePhone(phone, password);
  const token = leanCurUser.getSessionToken();

  // result = {
  //   jsonRoles,
  //   jsonPermissions,
  // }
  const result = await AV.Cloud.run('authGetRolesAndPermissions', {});

  // result = {
  //   jsonCurUser,
  //   token,
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
  //   jsonRoles,
  //   jsonPermissions,
  // }
  const result = await AV.Cloud.run('authGetRolesAndPermissions', {});

  // result = {
  //   jsonCurUser,
  //   token,
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
 *   count,
 *   jsonUsers
 * }
 */
export async function listAdminUsers(payload) {
  return await AV.Cloud.run('authListAdminUsers', payload);
}

/**
 *
 * @param payload
 * @returns {*|Promise}
 */
export async function fetchUserByPhone(payload) {
  let params = {
    phone: payload.phone
  }
  return await AV.Cloud.run('authFetchUserByPhone', params);
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
  return await AV.Cloud.verifySmsCode(smsCode, phone)
}

/**
 *
 * @param payload phone,name,op
 * @returns {*}
 */
export async function requestSmsAuthCode(payload) {
  payload.ttl = 10
  return await AV.Cloud.requestSmsCode(payload)
}

/**
 * 根据用户手机号生成关注公众号的二维码
 * @param payload
 * @returns {*|Promise}
 */
export async function requestGenerateUserQrcode(payload) {
  let params = {
    phone: payload.phone
  }
  return await AV.Cloud.run('wechatGenerateUserQrcode', params)
}

/**
 * 给系统管理员发送授权码
 * @param payload
 * @returns {*|Promise}
 */
export async function requestSysAuthCode(payload) {
  let params = {
    operator: payload.operator,
    operation: payload.operation,
  }
  return await AV.Cloud.run('sysauthSendAuthCode', params)
}

/**
 * 校验授权码
 * @param payload
 * @returns {*|Promise}
 */
export async function verifySysAuthCode(payload) {
  let params = {
    operator: payload.operator,
    code: payload.code,
  }
  return await AV.Cloud.run('sysauthVerifyAuthCode', params)
}
