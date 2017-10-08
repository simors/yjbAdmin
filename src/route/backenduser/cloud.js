import sleep from '../../util/sleep';

export async function createUser(payload) {
  try {
    await sleep(500);
    return {
      success: true,
      user: {
        id: 1, name: '孙燕姿', phoneNo: '13687338616', note: '', roles: ['平台管理员', '服务点管理员']
      }
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
