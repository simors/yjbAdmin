/**
 * Created by wanpeng on 2017/9/19.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {fetchDevicesApi, associateWithStationApi, modifyDeviceApi} from './cloud'
import {stationSelector} from '../station/redux'

/****  Model  ****/
const DeviceRecord = Record({
  id: undefined,                    //设备id
  deviceNo: undefined,              //设备编号
  status: undefined,                //设备状态
  deviceAddr: undefined,            //设备地址
  stationId: undefined,             //服务网点Id
  onlineTime: undefined,            //上线日期
}, 'DeviceRecord')

class Device extends DeviceRecord {
  static fromApi(obj) {
    let device = new DeviceRecord()
    return device.withMutations((record) => {
      record.set('id', obj.id)
      record.set('deviceNo', obj.deviceNo)
      record.set('status', obj.status)
      record.set('deviceAddr', obj.deviceAddr)
      record.set('stationId', obj.stationId)
      record.set('onlineTime', obj.onlineTime)
    })
  }
}

const DeviceState = Record({
  devices: Map(),            //设备信息 健为deviceId，DeviceRecord
  deviceList: List(),
}, 'DeviceState')

/**** Constant ****/
const FETCH_DEVICES = "FETCH_DEVICES"
const SAVE_DEVICES = "SAVE_DEVICES"
const ASSOCIATE_WITH_STATION = "ASSOCIATE_WITH_STATION"
const MODIFY_DEVICE = "MODIFY_DEVICE"
const SAVE_DEVICE = "SAVE_DEVICE"
const UPDATE_DEVICE_LIST = "UPDATE_DEVICE_LIST"

export const deviceStatus = {
  DEVICE_STATUS_IDLE : 0,           //空闲
  DEVICE_STATUS_OCCUPIED : 1,       //使用中
  DEVICE_STATUS_OFFLINE : 2,        //下线
  DEVICE_STATUS_FAULT : 3,          //故障
  DEVICE_STATUS_MAINTAIN : 4,       //维修保养
  DEVICE_STATUS_UNREGISTER : 5,     //未注册
}

/**** Action ****/

export const actions = {
  fetchDevicesAction: createAction(FETCH_DEVICES),
  associateWithStationAction: createAction(ASSOCIATE_WITH_STATION),
  modifyDeviceAction: createAction(MODIFY_DEVICE),
  saveDevices: createAction(SAVE_DEVICES),
  saveDevice: createAction(SAVE_DEVICE)
}

const updateDeviceList = createAction(UPDATE_DEVICE_LIST)

/**** Saga ****/
function* fetchDevices(action) {
  let payload = action.payload
  let apiPayload = {
    status: payload.status,
    deviceNo: payload.deviceNo,
    stationId: payload.stationId,
    limit: payload.limit,
    isRefresh: payload.isRefresh || true,
    lastUpdateTime: payload.lastUpdateTime,
  }

  try {
    let devices = yield call(fetchDevicesApi, apiPayload)
    if(payload.success) {
      payload.success()
    }
    yield put(updateDeviceList({ devices: devices, isRefresh: apiPayload.isRefresh }))
    let stations = new Set()
    devices.forEach((device) => {
      let station = device.station
      if(station) {
        stations.add(station)
      }
    })
    if(stations.size > 0) {
      //TODO 保存station信息
    }
  } catch (error) {
    console.error(error)
    if(payload.error) {
      payload.error(error)
    }
  }
}

function* associateWithStation(action) {
  let payload = action.payload

  try {
    let device = yield call(associateWithStationApi, payload)
    if(payload.success) {
      payload.success()
    }
    yield put(actions.saveDevice({ device }))
  } catch (error) {
    if(payload.error) {
      payload.error(error)
    }
  }

}

function* modifyDevice(action) {
  let payload = action.payload

  let modifyPayload = {
    deviceNo: payload.deviceNo,
    stationId: payload.stationId,
    deviceAddr: payload.deviceAddr,
    status: payload.status,
  }
  try {
    let device = yield call(modifyDeviceApi, modifyPayload)
    if(payload.success) {
      payload.success()
    }
    yield put(actions.saveDevice({ device }))
  } catch (error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export const saga = [
  takeLatest(FETCH_DEVICES, fetchDevices),
  takeLatest(ASSOCIATE_WITH_STATION, associateWithStation),
  takeLatest(MODIFY_DEVICE, modifyDevice)
]

/**** Reducer ****/
const initialState = DeviceState()

export function reducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_DEVICE:
      return handleSaveDevice(state, action)
    case SAVE_DEVICES:
      return handleSaveDevices(state, action)
    case UPDATE_DEVICE_LIST:
      return handleUpdateDeviceList(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSaveDevices(state, action) {
  let devices = action.payload.devices

  devices.forEach((device) => {
    let deviceRecord = Device.fromApi(device)
    state = state.setIn(['devices', device.id], deviceRecord)
  })
  return state
}

function handleSaveDevice(state, action) {
  let device = action.payload.device

  let deviceRecord = Device.fromApi(device)
  state = state.setIn(['devices', device.id], deviceRecord)

  return state
}

function handleUpdateDeviceList(state, action) {
  let devices = action.payload.devices
  let isRefresh = action.payload.isRefresh

  let deviceList = List()
  if(!isRefresh) {
    deviceList = state.get('deviceList')
  }
  devices.forEach((device) => {
    let deviceRecord = Device.fromApi(device)
    state = state.setIn(['devices', device.id], deviceRecord)
    deviceList = deviceList.push(device.id)
  })
  state = state.set('deviceList', deviceList)

  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.DEVICE
  if (!incoming) return state

  let devicesMap = new Map(incoming.devices)
  try {
    for(let [deviceId, device] of devicesMap) {
      if(deviceId && device) {
        let deviceRecord = new DeviceRecord({...device})
        state = state.setIn(['devices', deviceId], deviceRecord)
      }
    }
  } catch (error) {
    devicesMap.clear()
  }

  let deviceList = incoming.deviceList
  if(deviceList) {
    state = state.set('deviceList', List(deviceList))
  }
  return state
}



/**** Selector ****/
function selectDevice(state, deviceId) {
  if(!deviceId) {
    return undefined
  }

  let deviceRecord = state.DEVICE.getIn(['devices', deviceId])
  return deviceRecord? deviceRecord.toJS() : undefined
}

function selectDeviceList(state) {
  let deviceList = state.DEVICE.get('deviceList')
  let deviceInfoList = []
  deviceList.toArray().forEach((deviceId) => {
    let deviceInfo = selectDevice(state, deviceId)
    let station = deviceInfo? stationSelector.selectStationById(state, deviceInfo.stationId) : undefined
    deviceInfo.stationName = station? station.name : undefined
    deviceInfoList.push(deviceInfo)
  })
  return deviceInfoList
}

export const selector = {
  selectDevice,
  selectDeviceList,
}

