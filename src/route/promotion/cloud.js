/**
 * Created by wanpeng on 2017/10/10.
 */
import AV from 'leancloud-storage'

export async function createPromotionApi(payload) {
  try {
    let promotion = await AV.Cloud.run('promotionCreatePromotion', payload)
    return promotion
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function fetchPromotionCategoriesApi(payload) {
  try {

  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function fetchPromotionsApi(payload) {
  try {
    let promotions = await AV.Cloud.run('promotionFetchPromotions', payload)
    return promotions
  } catch (error) {
    console.error(error)
    throw error
  }
}
