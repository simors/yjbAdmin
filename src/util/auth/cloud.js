import AV from 'leancloud-storage';
import sleep from '../../util/sleep';

export async function loginWithMobilePhone(payload) {
  try {
    const {phone, password} = payload;

    const user = await AV.User.logInWithMobilePhone(phone, password);
    const token = user.getSessionToken();

    return ({
      user: {...user.toJSON()},
      token,
    });
  } catch (e) {
    throw e;
  }
}

export async function become(payload) {
  try {
    const {token: oldToken} = payload;

    const user = await AV.User.become(oldToken);
    const token = user.getSessionToken();

    return ({
      user: {...user.toJSON()},
      token,
    });
  } catch (e) {
    throw e;
  }
}

export async function logout(payload) {
  try {
    await AV.User.logOut();
  } catch (e) {
  }
}

export async function fetchUserList(payload) {
  // TODO: move to server side implementation

  try {
    const {params} = payload;

    // TODO: filter params

    const users = [];
    const userRolePairs = {};

    // TODO: limit

    const query = new AV.Query('_User');
    query.descending('createdAt');
    query.equalTo('type', 'admin');

    const leanUsers = await query.find();

    await Promise.all(leanUsers.map(
      async (leanUser) => {
        const ptrUser = AV.Object.createWithoutData('_User', leanUser.id);

        const query = new AV.Query('User_Role_Map');
        query.equalTo('user', ptrUser);
        query.include(['role']);

        const leanUserRolePairs = await query.find();

        const roles = [];

        leanUserRolePairs.forEach((i) => {
          roles.push(i.get('role').toJSON());
        });

        userRolePairs[leanUser.id] = roles;
      }
    ));

    leanUsers.forEach((i) => {
      users.push({
        ...i.toJSON(),
        roles: userRolePairs[i.id],
      })
    });

    return {
      success: true,
      users
    };
  } catch (e) {
    return {
      success: false,
      error: e
    };
  }
}

export async function createUser(payload) {
  // TODO: move to server side implementation

  try {
    const {params} = payload;

    const jsonUser = {
    };

    ({
      email: jsonUser.email,
      mobilePhoneNumber: jsonUser.mobilePhoneNumber,
      authData: jsonUser.authData,
      username: jsonUser.username,  // must be set
      password: jsonUser.password,  // must be set
      nickname: jsonUser.nickname,
      avatar: jsonUser.avatar,
      sex: jsonUser.sex,
      language: jsonUser.language,
      country: jsonUser.country,
      province: jsonUser.province,
      city: jsonUser.city,
      idNumber: jsonUser.idNumber,
      idName: jsonUser.idName,
      type: jsonUser.type,
      note: jsonUser.note,
    } = params);

    const {roles} = params;

    if (!jsonUser.username) { // TODO: wechat user
      if (jsonUser.mobilePhoneNumber) {
        jsonUser.username = jsonUser.mobilePhoneNumber;
      }
    }

    if (!jsonUser.username || !jsonUser.password) {
      throw Error('username and password must be set');
    }

    // define db table
    const User = AV.Object.extend('_User');
    const UserRoleMap = AV.Object.extend('User_Role_Map');

    // check 'mobilePhoneNumber' and 'username' existent
    if (jsonUser.mobilePhoneNumber) {
      const query = new AV.Query('_User');
      query.equalTo('mobilePhoneNumber', jsonUser.mobilePhoneNumber);

      const count = await query.count();
      if (count > 0) {
        throw Error('mobilePhoneNumber already exists');
      }
    }

    const query = new AV.Query('_User');
    query.equalTo('username', jsonUser.username);

    const count = await query.count();
    if (count > 0) {
      throw Error('username already exists');
    }

    // insert into _User
    const user = new User(jsonUser);
    const leanUser = await user.save();

    // create _User and _Role pointer and insert into User_Role_Map
    const userRolePairs = [];

    const ptrUser = AV.Object.createWithoutData('_User', leanUser.id);

    // TODO: pass role id as payload
    await Promise.all(roles.map(
      async (role) => {
        const query = new AV.Query('_Role');
        query.equalTo('code', role);
        const leanRole = await query.first();

        const ptrRole = AV.Object.createWithoutData('_Role', leanRole.id);

        const userRolePair = new UserRoleMap({
          user: ptrUser,
          role: ptrRole
        });

        userRolePairs.push(userRolePair);
      }
    ));

    await AV.Object.saveAll(userRolePairs);

    return {
      success: true,
    };
  } catch (e) {
    console.log('failed to create user: ', e);
    return {
      success: false,
      error: e
    };
  }
}

export async function deleteUser(payload) {
  // TODO: move to server side implementation

  try {
    const {params} = payload;
    const {id} = params;

    const ptrUser = AV.Object.createWithoutData('_User', id);

    const query = new AV.Query('User_Role_Map');
    query.equalTo('user', ptrUser);

    const leanUserRolePairs = await query.find();

    const ptrUserRolePairs = [];
    leanUserRolePairs.forEach((i) => {
      const ptrUserRolePair = AV.Object.createWithoutData('User_Role_Map', i.id);

      ptrUserRolePairs.push(ptrUserRolePair);
    });

    await AV.Object.destroyAll([...ptrUserRolePairs, ptrUser]);

    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      error: e
    };
  }
}

export async function updateUser(payload) {
  // TODO: move to server side implementation

  try {
    const {params} = payload;

    const jsonUser = {
    };

    ({
      email: jsonUser.email,
      // mobilePhoneNumber: jsonUser.mobilePhoneNumber,
      authData: jsonUser.authData,
      // username: jsonUser.username,
      password: jsonUser.password,
      nickname: jsonUser.nickname,
      avatar: jsonUser.avatar,
      sex: jsonUser.sex,
      language: jsonUser.language,
      country: jsonUser.country,
      province: jsonUser.province,
      city: jsonUser.city,
      idNumber: jsonUser.idNumber,
      idName: jsonUser.idName,
      type: jsonUser.type,
      note: jsonUser.note,
    } = params);

    const {id, roles} = params;

    // update User_Role_Map

    const ptrUser = AV.Object.createWithoutData('_User', id);

    const query = new AV.Query('User_Role_Map');
    query.equalTo('user', ptrUser);
    query.include(['role']);

    const leanUserRolePairs = await query.find();

    const oldRoles = [];

    leanUserRolePairs.forEach((i) => {
      oldRoles.push(i.get('role').toJSON().code);
    });

    // TODO: pass role id as payload
    // role is identified by code
    const rolesToAdd = [...roles].filter(i => ! new Set(oldRoles).has(i));
    const rolesToRemove = [...oldRoles].filter(i => ! new Set(roles).has(i));

    const queryAllRoles = new AV.Query('_Role');
    const leanAllRoles = await queryAllRoles.find();
    const jsonAllRoles = {};
    leanAllRoles.forEach((i) => {
      const jsonRole = i.toJSON();
      jsonAllRoles[jsonRole.code] = jsonRole;
    });

    const ptrUserRolePairsToAdd = [];
    const ptrUserRolePairsToRemove = [];

    rolesToAdd.forEach((i) => {
      const id = jsonAllRoles[i].objectId;
      const ptrUserRolePair = AV.Object.createWithoutData('User_Role_Map', id);

      ptrUserRolePairsToAdd.push(ptrUserRolePair);
    });

    rolesToRemove.forEach((i) => {
      const id = jsonAllRoles[i].objectId;
      const ptrUserRolePair = AV.Object.createWithoutData('User_Role_Map', id);

      ptrUserRolePairsToRemove.push(ptrUserRolePair);
    });

    await AV.Object.saveAll(ptrUserRolePairsToAdd);
    await AV.Object.destroyAll(ptrUserRolePairsToRemove);

    // update _User
    for (const [key, value] of Object.entries(jsonUser)) {
      ptrUser.set(key, value);
    }
    const leanUser = await ptrUser.save();

    return {
      success: true,
    };
  } catch (e) {
    console.log('failed to update user: ', e);
    return {
      success: false,
      error: e
    };
  }
}
