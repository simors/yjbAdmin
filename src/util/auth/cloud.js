import AV from 'leancloud-storage';
import sleep from '../sleep';

export async function loginWithMobilePhone(payload) {
  try {
    const {phone, password} = payload;

    const user = await AV.User.logInWithMobilePhone(phone, password);
    const token = user.getSessionToken();
    console.log("------> loginWithMobilePhone: ", user);

    return ({
      userInfo: {
        userId: user.id,
        ...user.attributes,
        createAt: user.createdAt.valueOf(),
        updateAt: user.updatedAt.valueOf(),
      },
      token
    });
  } catch (e) {
    console.log("---> exception: ", e);
    throw e;
  }
}

export async function become(payload) {
  try {
    const {token: oldToken} = payload;

    const user = await AV.User.become(oldToken);
    const token = user.getSessionToken();
    return ({
      userInfo: {
        userId: user.id,
        ...user.attributes,
        createAt: user.createdAt.valueOf(),
        updateAt: user.updatedAt.valueOf(),
      },
      token
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
