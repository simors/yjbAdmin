import AV from 'leancloud-storage';

export async function loginWithMobilePhone(payload) {
  const {phone, password} = payload;

  const leanActiveUser = await AV.User.logInWithMobilePhone(phone, password);
  const token = leanActiveUser.getSessionToken();

  const jsonRes = await AV.Cloud.run('authFetchRolesAndPermissions', {});

  return ({
    jsonActiveUser: {
      ...leanActiveUser.toJSON(),
      id: leanActiveUser.id,
    },
    token,
    ...jsonRes,
  });
}

export async function become(payload) {
  const {token: oldToken} = payload;

  const leanActiveUser = await AV.User.become(oldToken);
  const token = leanActiveUser.getSessionToken();

  const jsonRes = await AV.Cloud.run('authFetchRolesAndPermissions', {});

  return ({
    jsonActiveUser: {
      ...leanActiveUser.toJSON(),
      id: leanActiveUser.id,
    },
    token,
    ...jsonRes,
  });
}

export async function logout(payload) {
  await AV.User.logOut();
}

export async function listUsers(payload) {
  return await AV.Cloud.run('authFetchUserList', payload);
}

export async function createUser(payload) {
  return await AV.Cloud.run('authCreateUser', payload);
}

export async function deleteUser(payload) {
  return await AV.Cloud.run('authDeleteUser', payload);
}

export async function updateUser(payload) {
  return await AV.Cloud.run('authUpdateUser', payload);
}
