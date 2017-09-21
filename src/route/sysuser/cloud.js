import sleep from '../../util/sleep';

export async function User_fetch(payload) {
  try {
    await sleep(300);
    return {
      success: true,
      users: [
        {id: 1, name: '刘德华', password: '123456', phoneNo: '18175181287', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {id: 2, name: '罗润兵', password: '123456', phoneNo: '18175181288', note: '暂无', roles: ['平台管理员', '服务点管理员', '服务点投资人']},
        {id: 3, name: '孙燕姿', password: '123456', phoneNo: '18175181289', note: '暂无', roles: ['服务点投资人', '服务点管理员', '服务单位']},
        {id: 4, name: '孙燕姿', password: '123456', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务单位', '服务点管理员']},
        {id: 5, name: '孙燕姿', password: '123456', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务单位', '服务点投资人']},
        {id: 6, name: '孙燕姿', password: '123456', phoneNo: '18175181289', note: '暂无', roles: ['服务点管理员', '服务单位']},
        {id: 7, name: '孙燕姿', password: '123456', phoneNo: '18175181289', note: '暂无', roles: ['服务点投资人', '服务点管理员']},
        {id: 8, name: '孙燕姿', password: '123456', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {id: 9, name: '孙燕姿', password: '123456', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {id: 10, name: '孙燕姿', password: '123456', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {id: 11, name: '孙燕姿', password: '123456', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
        {id: 12, name: '孙燕姿', password: '123456', phoneNo: '18175181289', note: '暂无', roles: ['平台管理员', '服务点管理员']},
      ]
    };
  } catch (e) {
    return {
      success: false,
      error: e
    };
  }
}

export async function User_detail(payload) {
  try {
    await sleep(500);
    return {
      success: true,
      user: {
        id: 1, name: '罗润兵', password: '123456', phoneNo: '13687338616', note: '', roles: ['平台管理员', '服务点管理员']
      }
    };
  } catch (e) {
    return {
      success: false,
      error: e
    };
  }
}

export async function User_create(payload) {
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

export async function User_delete(payload) {
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

export async function User_update(payload) {
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
