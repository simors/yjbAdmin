/**
 * Created by lilu on 2017/10/14.
 */

import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import * as stationFuncs from './cloud'

/****  Model  ****/

export const AccountRecord = Record({
  stationAccounts: List(),
  allStationAccounts: Map(),
  allPartnerAccounts: Map(),
  allInvestorAccounts: Map(),
  partnerAccounts: List(),
  investorAccounts: List(),
}, "StationRecord")

export const StationAccountDetailRecord = Record({
  // id: undefined,
  // province: undefined,
  // city: undefined,
  // area: undefined,
  // deposit: undefined,
  // addr: undefined,
  // name: undefined,
  // platformProp: undefined,
  // powerUnitPrice: undefined,
  // unitPrice: undefined,
  // adminId: undefined,
  // adminName: undefined,
  // adminPhone: undefined,
  // status: undefined,
  // deviceNo: undefined,
  // createdAt: undefined,
}, 'StationDetailRecord')

export class StationAccountDetail extends StationAccountDetailRecord {
  static fromApi(obj) {
    console.log('obj====>',obj)
    let stationDetail = new StationDetailRecord()
    return stationDetail.withMutations((record) => {
      record.set('id', obj.id)
      record.set('province', obj.province)
      record.set('city', obj.city)
      record.set('area', obj.area)
      record.set('deposit', obj.deposit)
      record.set('addr', obj.addr)
      record.set('name', obj.name)
      record.set('platformProp', obj.platformProp)
      record.set('powerUnitPrice', obj.powerUnitPrice)
      record.set('unitPrice', obj.unitPrice)
      record.set('adminId', obj.adminId ? obj.adminId : obj.admin.id)
      record.set('adminName', obj.adminName ? obj.adminName : obj.admin.nickname)
      record.set('adminPhone', obj.adminPhone ? obj.adminPhone : obj.admin.mobilePhoneNumber)
      record.set('status', obj.status)
      record.set('deviceNo', obj.deviceNo)
      record.set('createdAt', obj.createdAt)
    })
  }
}

/**** Constant ****/

const FETCH_STATIONS = 'FETCH_STATIONS'

/**** Action ****/

export const stationAction = {
  requestStations: createAction(FETCH_STATIONS),

}

const requestStationsSuccess = createAction(FETCH_STATIONS_SUCCESS)



/**** Saga ****/

function* fetchStationsAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.fetchStations, payload)
  let stations = []
  let stationList = []
  if (data.success) {
    if (data.stations && data.stations.length > 0) {
      data.stations.forEach((item)=> {
        stationList.push(item.id)
        stations.push(StationDetail.fromApi(item))
      })
    }
    yield put(requestStationsSuccess({stations: stations, stationList: stationList}))
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}


export const stationSaga = [
  takeLatest(FETCH_STATIONS, fetchStationsAction),

]

/**** Reducer ****/

const initialState = StationRecord()

export function stationReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_STATIONS_SUCCESS:
      return handleSaveStations(state, action)
    default:
      return state
  }
}

function handleSetAllStations(state, stations) {
  stations.forEach((item)=> {
    state = state.setIn(['allStations', item.id], item)
  })
  return state
}


/**** Selector ****/

function selectStations(state) {
  let station = state.STATION
  let stationList = station.stationList
  let stations = []
  if (stationList && stationList.size > 0) {
    stationList.forEach((item)=> {
      let stationInfo = station.getIn(['allStations', item])
      stations.push(stationInfo.toJS())
    })
  }
  return stations
}


export const stationSelector = {
  selectStations,

}
