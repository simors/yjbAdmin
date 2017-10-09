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
  try {
    await sleep(300);
    return {
      success: true,
      users: [
        {objectId: 1, idName: '刘德华', mobilePhoneNumber: '18175181287', note: '', roles: [100, 200]},
        {objectId: 2, idName: '罗润兵', mobilePhoneNumber: '18175181288', note: '', roles: [100, 200, 300]},
        {objectId: 3, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '', roles: [100, 400]},
        {objectId: 4, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '', roles: [300, 200]},
        {objectId: 5, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '', roles: [400, 100, 300]},
      ]
    };
  } catch (e) {
    return {
      success: false,
      error: e
    };
  }
}

export async function createUser(payload) {
  try {
    await sleep(500);
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
