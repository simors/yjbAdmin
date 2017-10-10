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

        const leanUserRoleMaps = await query.find();

        const roles = [];

        leanUserRoleMaps.forEach((i) => {
          roles.push(i.get('role').toJSON());
        });

        users.push({
          ...leanUser.toJSON(),
          roles
        })
      }
    ));

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
    const userRoleMaps = [];

    const ptrUser = AV.Object.createWithoutData('_User', leanUser.id);

    await Promise.all(roles.map(
      async (role) => {
        const query = new AV.Query('_Role');
        query.equalTo('code', role);
        const leanRole = await query.first();

        const ptrRole = AV.Object.createWithoutData('_Role', leanRole.id);

        const userRoleMap = new UserRoleMap({
          user: ptrUser,
          role: ptrRole
        });

        userRoleMaps.push(userRoleMap);
      }
    ));

    await AV.Object.saveAll(userRoleMaps);

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
  try {
    await sleep(500);
    return {
      success: true,
      user: {
        id: 1, name: '刘德华', phoneNo: '13687338616', note: '', roles: ['平台管理员', '服务点管理员']
      }
    };
  } catch (e) {
    return {
      success: false,
      error: e
    };
  }
}

export async function updateUser(payload) {
  try {
    await sleep(500);
    return {
      success: true,
      user: {
        id: 1, name: '张学友', phoneNo: '13687338616', note: '', roles: ['平台管理员', '服务点管理员']
      }
    };
  } catch (e) {
    return {
      success: false,
      error: e
    };
  }
}
