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

export async function stat3MonthsAccountProfit(payload) {
  let params = {
    accountType: payload.accountType,
  }
  return await AV.Cloud.run('accountStatLast3MonthsAccountProfit', params)
}

export async function statHalfYearAccountProfit(payload) {
  let params = {
    accountType: payload.accountType,
  }
  return await AV.Cloud.run('accountStatLastHalfYearAccountProfit', params)
}

export async function stat1YearAccountProfit(payload) {
  let params = {
    accountType: payload.accountType,
  }
  return await AV.Cloud.run('accountStatLast1YearAccountProfit', params)
}

export async function createWithdrawApply(payload) {
  let params = {
    amount: payload.amount,
    applyType: payload.applyType,
  }
  return await AV.Cloud.run('withdrawCreateApply', params)
}

export async function getProfitSharing(payload) {
  let params = {
    type: payload.type,
  }
  return await AV.Cloud.run('stationFetchProfitSharebyUser', params)
}

export async function fetchWithdrawLog(payload) {
  let params = {
    startTime: payload.start,
    endTime: payload.end,
    applyType: payload.applyType,
  }
  return await AV.Cloud.run('withdrawFetchApply', params)
}