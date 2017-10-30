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