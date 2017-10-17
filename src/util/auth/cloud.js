import AV from 'leancloud-storage';

export async function loginWithMobilePhone(payload) {
  const {phone, password} = payload;

  const leanCurUser = await AV.User.logInWithMobilePhone(phone, password);
  const token = leanCurUser.getSessionToken();

  // result = {
  //   jsonCurRoleIds,
  //   jsonRoles,
  //   jsonPermissions,
  // }
  const jsonRes = await AV.Cloud.run('authGetRolesAndPermissions', {});

  // result = {
  //   jsonCurUser,
  //   token,
  //   jsonCurRoleIds,
  //   jsonRoles,
  //   jsonPermissions,
  // }
  return ({
    jsonCurUser: {
      ...leanCurUser.toJSON(),
      id: leanCurUser.id,
    },
    token,
    ...jsonRes,
  });
}

export async function become(payload) {
  const {token: oldToken} = payload;

  const leanCurUser = await AV.User.become(oldToken);
  const token = leanCurUser.getSessionToken();

  // result = {
  //   jsonCurRoleIds,
  //   jsonRoles,
  //   jsonPermissions,
  // }
  const jsonRes = await AV.Cloud.run('authGetRolesAndPermissions', {});

  // result = {
  //   jsonCurUser,
  //   token,
  //   jsonCurRoleIds,
  //   jsonRoles,
  //   jsonPermissions,
  // }
  return ({
    jsonCurUser: {
      ...leanCurUser.toJSON(),
      id: leanCurUser.id,
    },
    token,
    ...jsonRes,
  });
}

export async function logout(payload) {
  await AV.User.logOut();
}

export async function listUsers(payload) {
  // result = {
  //   jsonUsers,
  // }
  return await AV.Cloud.run('authListUsers', payload);
}

export async function createUser(payload) {
  // result = {
  //
  // }
  return await AV.Cloud.run('authCreateUser', payload);
}

export async function deleteUser(payload) {
  // result = {
  //
  // }
  return await AV.Cloud.run('authDeleteUser', payload);
}

export async function updateUser(payload) {
  // result = {
  //
  // }
  return await AV.Cloud.run('authUpdateUser', payload);
}
