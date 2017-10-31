/**
 * Created by yangyang on 2017/10/30.
 */
import {call, put, takeLatest} from 'redux-saga/effects';
import {createAction} from 'redux-actions';
import {Record, Map, Set, List} from 'immutable';
import {REHYDRATE} from 'redux-persist/constants';
import * as dashboardCloud from './cloud'

/******* Model *******/

class MpUserStat extends Record({
  mpUserCount: undefined,
  lastDayMpCount: undefined,
  lastMonthMpCount: undefined,
  lastYearMpCount: undefined,
}, 'MpUserStat') {
  static fromJson(json) {
    let mpUserStat = new MpUserStat()
    return mpUserStat.withMutations((record) => {
      record.set('mpUserCount', json.mpUserCount)
      record.set('lastDayMpCount', json.lastDayMpCount)
      record.set('lastMonthMpCount', json.lastMonthMpCount)
      record.set('lastYearMpCount', json.lastYearMpCount)
    })
  }
}

class DeviceStat extends Record({
  deviceCount: undefined,
  lastDayDeviceCount: undefined,
  lastMonthDeviceCount: undefined,
  lastYearDeviceCount: undefined,
}, 'DeviceStat') {
  static fromJson(json) {
    let deviceStat = new DeviceStat()
    return deviceStat.withMutations((record) => {
      record.set('deviceCount', json.deviceCount)
      record.set('lastDayDeviceCount', json.lastDayDeviceCount)
      record.set('lastMonthDeviceCount', json.lastMonthDeviceCount)
      record.set('lastYearDeviceCount', json.lastYearDeviceCount)
    })
  }
}

class StationStat extends Record({
  stationCount: undefined,
  lastDayStationCount: undefined,
  lastMonthStationCount: undefined,
  lastYearStationCount: undefined,
}, 'StationStat') {
  static fromJson(json) {
    let stationStat = new StationStat()
    return stationStat.withMutations((record) => {
      record.set('stationCount', json.stationCount)
      record.set('lastDayStationCount', json.lastDayStationCount)
      record.set('lastMonthStationCount', json.lastMonthStationCount)
      record.set('lastYearStationCount', json.lastYearStationCount)
    })
  }
}

class Dashboard extends Record({
  mpUserStat: undefined,
  deviceStat: undefined,
  stationStat: undefined,
}, 'Dashboard') {}

/******* Constants *******/

const REQUEST_MP_USER_STAT = 'REQUEST_MP_USER_STAT'
const SAVE_MP_USER_STAT = 'SAVE_MP_USER_STAT'
const REQUEST_DEVICE_STAT = 'REQUEST_DEVICE_STAT'
const SAVE_DEVICE_STAT = 'SAVE_DEVICE_STAT'
const REQUEST_STATION_STAT = 'REQUEST_STATION_STAT'
const SAVE_STATION_STAT = 'SAVE_STATION_STAT'

/******* Action *******/

export const dashboardAction = {
  requestMpUserStat: createAction(REQUEST_MP_USER_STAT),
  requestDeviceStat: createAction(REQUEST_DEVICE_STAT),
  requestStationStat: createAction(REQUEST_STATION_STAT),
}

const saveMpUserStat = createAction(SAVE_MP_USER_STAT)
const saveDeviceStat = createAction(SAVE_DEVICE_STAT)
const saveStationStat = createAction(SAVE_STATION_STAT)

/******* Saga *******/

export const dashboardSaga = [
  takeLatest(REQUEST_MP_USER_STAT, sagaFetchMpUserStat),
  takeLatest(REQUEST_DEVICE_STAT, sagaFetchDeviceStat),
  takeLatest(REQUEST_STATION_STAT, sagaFetchStationStat),
]

function* sagaFetchMpUserStat(action) {
  let payload = action.payload
  try {
    let result = yield call(dashboardCloud.fetchMpUserStat)
    yield put(saveMpUserStat({mpStat: result}))
    if (payload.success) {
      payload.success();
    }
  } catch (e) {
    if (payload.error) {
      payload.error(e.code);
    }
  }
}

function* sagaFetchDeviceStat(action) {
  let payload = action.payload
  try {
    let result = yield call(dashboardCloud.fetchDeviceStat)
    yield put(saveDeviceStat({deviceStat: result}))
    if (payload.success) {
      payload.success();
    }
  } catch (e) {
    if (payload.error) {
      payload.error(e.code);
    }
  }
}

function* sagaFetchStationStat(action) {
  let payload = action.payload
  try {
    let result = yield call(dashboardCloud.fetchStationStat)
    yield put(saveStationStat({stationStat: result}))
    if (payload.success) {
      payload.success();
    }
  } catch (e) {
    if (payload.error) {
      payload.error(e.code);
    }
  }
}

/******* Reducer *******/

const initialState = new Dashboard();

export function dashboardReducer(state=initialState, action) {
  switch(action.type) {
    case SAVE_MP_USER_STAT:
      return reduceSaveMpUserStat(state, action)
    case SAVE_DEVICE_STAT:
      return reduceSaveDeviceStat(state, action)
    case SAVE_STATION_STAT:
      return reduceSaveStationStat(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function reduceSaveMpUserStat(state, action) {
  let payload = action.payload
  let mpStat = payload.mpStat
  state = state.set('mpUserStat', MpUserStat.fromJson(mpStat))
  return state
}

function reduceSaveDeviceStat(state, action) {
  let payload = action.payload
  let deviceStat = payload.deviceStat
  state = state.set('deviceStat', DeviceStat.fromJson(deviceStat))
  return state
}

function reduceSaveStationStat(state, action) {
  let payload = action.payload
  let stationStat = payload.stationStat
  state = state.set('stationStat', StationStat.fromJson(stationStat))
  return state
}

function onRehydrate(state, action) {
  const incoming = action.payload.DASHBOARD;
  if (!incoming) {
    return state
  }
  let mpUserStat = incoming.mpUserStat
  if (mpUserStat) {
    state = state.set('mpUserStat', MpUserStat.fromJson(mpUserStat))
  }

  let deviceStat = incoming.deviceStat
  if (deviceStat) {
    state = state.set('deviceStat', DeviceStat.fromJson(deviceStat))
  }

  let stationStat = incoming.stationStat
  if (stationStat) {
    state = state.set('stationStat', StationStat.fromJson(stationStat))
  }
  return state
}

/******* Selector *******/

export const dashboardSelector = {
  selectMpUserStat,
  selectDeviceStat,
  selectStationStat,
}

function selectMpUserStat(state) {
  let mpUserStat = state.DASHBOARD.mpUserStat
  if (!mpUserStat) {
    return undefined
  }
  return mpUserStat.toJS()
}

function selectDeviceStat(state) {
  let deviceStat = state.DASHBOARD.deviceStat
  if (!deviceStat) {
    return undefined
  }
  return deviceStat.toJS()
}

function selectStationStat(state) {
  let stationStat = state.DASHBOARD.stationStat
  if (!stationStat) {
    return undefined
  }
  return stationStat.toJS()
}