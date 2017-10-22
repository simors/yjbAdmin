/**
 * Created by wanpeng on 2017/10/10.
 */
import AV from 'leancloud-storage'

export async function createPromotionApi(payload) {
  return await AV.Cloud.run('promCreatePromotion', payload)
}

export async function fetchPromotionCategoriesApi(payload) {
  return await AV.Cloud.run('promFetchPromotionCategoryList', payload)
}

export async function fetchPromotionsApi(payload) {
  return await AV.Cloud.run('promFetchPromotions', payload)
}

export async function editPromotionApi(payload) {
  return await AV.Cloud.run('promEditPromotion', payload)
}

export async function fetchRechargePromRecordApi(payload) {
  return await AV.Cloud.run('promFetchRechargePromRecord', payload)
}
