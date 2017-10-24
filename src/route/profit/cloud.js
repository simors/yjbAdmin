/**
 * Created by yangyang on 2017/10/21.
 */
import AV from 'leancloud-storage'

export async function fetchAdminProfit() {
  return await AV.Cloud.run('profitQueryProfit', {})
}

export async function stat30DaysAccountProfit(payload) {
  let params = {
    accountType: payload.accountType,
  }
  return await AV.Cloud.run('accountStatLast30DaysAccountProfit', params)
}

export async function createTransfer(payload) {
  return await AV.Cloud.run('pingppCreateTransfer', payload)
}