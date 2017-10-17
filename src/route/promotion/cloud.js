/**
 * Created by wanpeng on 2017/10/10.
 */
import AV from 'leancloud-storage'

export async function createPromotionApi(payload) {
  try {
    let promotion = await AV.Cloud.run('promCreatePromotion', payload)
    return promotion
  } catch (error) {
    console.log("createPromotionApi errorCode", error.code)
    console.error(error)
    throw error
  }
}

export async function fetchPromotionCategoriesApi(payload) {
  return await AV.Cloud.run('promFetchPromotionCategoryList', payload)
}

export async function fetchPromotionsApi(payload) {
  return await AV.Cloud.run('promFetchPromotions', payload)
}
