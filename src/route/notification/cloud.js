import AV from 'leancloud-storage';

export async function sendSystemNotification(params) {
  return await AV.Cloud.run('sendSystemNotification', params);
}

export async function sendPromotionNotification(params) {
  return await AV.Cloud.run('sendPromotionNotification', params);
}
