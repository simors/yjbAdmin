import sleep from '../../util/sleep';

export async function userList(payload) {
  try {
    await sleep(300);
    return {
      success: true,
      users: [
        {id: 1, name: '刘德华', phoneNo: '18175181287', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {id: 2, name: '罗润兵', phoneNo: '18175181288', note: '暂无', roles: ['平台管理员', '服务点管理员', '服务点投资人']},
        {id: 3, name: '孙燕姿', phoneNo: '18175181289', note: '暂无', roles: ['服务点投资人', '服务点管理员', '服务单位']},
        {id: 4, name: '孙燕姿', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务单位', '服务点管理员']},
        {id: 5, name: '孙燕姿', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务单位', '服务点投资人']},
        {id: 6, name: '孙燕姿', phoneNo: '18175181289', note: '暂无', roles: ['服务点管理员', '服务单位']},
        {id: 7, name: '孙燕姿', phoneNo: '18175181289', note: '暂无', roles: ['服务点投资人', '服务点管理员']},
        {id: 8, name: '孙燕姿', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {id: 9, name: '孙燕姿', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {id: 10, name: '孙燕姿', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {id: 11, name: '孙燕姿', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {id: 12, name: '孙燕姿', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
      ]
    };
  } catch (e) {
    return {
      success: false,
      error: e
    };
  }
}

export async function userShow(payload) {
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

export async function userCreate(payload) {
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

export async function userEdit(payload) {
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

export async function userDelete(payload) {
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

export async function userSave(payload) {
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

export async function roleList(payload) {
  try {
    await sleep(300);
    return {
      success: true,
      roles: [
        '平台管理员', '服务点管理员', '服务点投资人', '服务单位'
      ]
    };
  } catch (e) {
    return {
      success: false,
      error: e
    };
  }
}
