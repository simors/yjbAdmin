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
        {objectId: 1, idName: '刘德华', mobilePhoneNumber: '18175181287', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {objectId: 2, idName: '罗润兵', mobilePhoneNumber: '18175181288', note: '暂无', roles: ['平台管理员', '服务点管理员', '服务点投资人']},
        {objectId: 3, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '暂无', roles: ['服务点投资人', '服务点管理员', '服务单位']},
        {objectId: 4, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '暂无', roles: ['平台管理员', '服务单位', '服务点管理员']},
        {objectId: 5, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '暂无', roles: ['平台管理员', '服务单位', '服务点投资人']},
        {objectId: 6, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '暂无', roles: ['服务点管理员', '服务单位']},
        {objectId: 7, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '暂无', roles: ['服务点投资人', '服务点管理员']},
        {objectId: 8, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {objectId: 9, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {objectId: 10, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {objectId: 11, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {objectId: 12, idName: '孙燕姿', mobilePhoneNumber: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
      ]
    };
  } catch (e) {
    return {
      success: false,
      error: e
    };
  }
}
