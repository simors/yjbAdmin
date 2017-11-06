/**
 * Created by wanpeng on 2017/9/26.
 */
import AV from 'leancloud-storage'

export async function fetchOrdersApi(payload) {
  try {
    let result = await AV.Cloud.run('orderFetchOrders', payload)
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function fetchDealRecordApi(payload) {
  return await AV.Cloud.run('pingppFetchDealRecord', payload)
}

export async function fetchWithdrawApply(payload) {
  let params = {
    startTime: payload.start,
    endTime: payload.end,
    phone: payload.mobilePhoneNumber,
    applyType: payload.applyType,
    status: payload.status,
    limit: payload.limit,
  }
  return await AV.Cloud.run('withdrawFetchApply', params)
}