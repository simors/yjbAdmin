/**
 * Created by wanpeng on 2017/9/26.
 */
import AV from 'leancloud-storage'

export async function fetchOrdersApi(payload) {
  try {
    let orders = await AV.Cloud.run('orderFetchOrders', payload)
    return orders
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function fetchRechargesApi(payload) {
  try {
    let recharges = await AV.Cloud.run('pingppFetchRecharges', payload)
    return recharges
  } catch (error) {
    console.error(error)
    throw error
  }
}
