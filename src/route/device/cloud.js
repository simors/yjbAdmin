/**
 * Created by wanpeng on 2017/9/30.
 */
import AV from 'leancloud-storage'

export async function fetchDevicesApi(payload) {
  try {
    let result = await AV.Cloud.run('deviceFetchDevices', payload)
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function associateWithStationApi(payload) {
  try {
    let device = await AV.Cloud.run('deviceAssociateWithStation', payload)
    return device
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function modifyDeviceApi(payload) {
  try {
    let device = await AV.Cloud.run('deviceUpdateDevice', payload)
    return device
  } catch (error) {
    console.error(error)
    throw error
  }
}
