/**
 * Created by yangyang on 2017/10/30.
 */
import AV from 'leancloud-storage';

export async function fetchMpUserStat() {
  return await AV.Cloud.run('authStatMpUser', {})
}

export async function fetchDeviceStat() {
  return await AV.Cloud.run('deviceStatDevice', {})
}

export async function fetchStationStat() {
  return await AV.Cloud.run('stationFetchStationStat', {})
}

export async function fetchPlatformProfitStat() {
  return await AV.Cloud.run('accountStatPlatformAccount', {})
}

export async function fetchStationAccountRank(payload) {
  let params = {
    rankDate: payload.rankDate,
  }
  return await AV.Cloud.run('accountFetchStationAccountRank', params)
}