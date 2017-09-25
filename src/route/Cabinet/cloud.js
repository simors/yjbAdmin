/**
 * Created by wanpeng on 2017/9/19.
 */
import AV from 'leancloud-storage'

export async function fetchCabinetsApi(payload) {
  try {
    let cabinetList = await AV.Cloud.run('deviceFetchDevices', payload)
    return cabinetList
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function associateWithStationApi(payload) {
  try {
    let cabinet = await AV.Cloud.run('deviceAssociateWithStation', payload)
    return cabinet
  } catch (error) {
    console.error(error)
    throw error
  }
}
