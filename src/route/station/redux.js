/**
 * Created by lilu on 2017/9/18.
 */

import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery,takeLatest } from 'redux-saga/effects'
import * as stationFuncs from './api'

/****  Model  ****/

export const StationRecord = Record({
  stationList: List(),
  allStations: Map(),
  partnerList: List(),
  allPartners: Map(),
  investorList: List(),
  allInvestors: Map(),
}, "StationRecord")

export const StationDetailRecord = Record({
  id: undefined,
  province: undefined,
  city: undefined,
  area: undefined,
  deposit: undefined,
  addr: undefined,
  name: undefined,
  platformProp: undefined,
  powerUnitPrice: undefined,
  unitPrice: undefined,
  adminId: undefined,
  adminName: undefined,
  adminPhone: undefined,
  status: undefined,
  deviceNo: undefined
}, 'StationDetailRecord')

export class StationDetail extends StationDetailRecord {
  static fromApi(obj) {
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
      record.set('adminId', obj.adminId)
      record.set('adminName', obj.adminName)
      record.set('adminPhone', obj.adminPhone)
      record.set('status', obj.status)
      record.set('deviceNo', obj.deviceNo)

    })
  }
}

export const ProfitSharingRecord = Record({
  id: undefined,
  type: undefined,
  royalty: undefined,
  investment: undefined,
  shareholderId: undefined,
  sharehlderName: undefined,
  sharehlderPhone: undefined,
  stationId: undefined,
  stationName: undefined,
}, 'ProfitSharingRecord')

export class ProfitSharing extends ProfitSharingRecord {
  static fromApi(obj) {
    let profitSharing = new ProfitSharingRecord()
    return profitSharing.withMutations((record) => {
      record.set('id', obj.id)
      record.set('type', obj.type)
      record.set('royalty', obj.royalty)
      record.set('investment', obj.investment)
      record.set('shareholderId', obj.shareholderId)
      record.set('sharehlderName', obj.sharehlderName)
      record.set('sharehlderPhone', obj.sharehlderPhone)
      record.set('stationId', obj.stationId)
      record.set('stationName', obj.stationName)
    })
  }
}



/**** Constant ****/

const FETCH_STATIONS = 'FETCH_STATIONS'
const FETCH_STATIONS_SUCCESS = 'FETCH_STATIONS_SUCCESS'
const OPEN_STATION = 'OPEN_STATION'
const OPEN_STATION_SUCCESS = 'OPEN_STATION_SUCCESS'
const CLOSE_STATION = 'CLOSE_STATION'
const CLOSE_STATION_SUCCESS = 'CLOSE_STATION_SUCCESS'
/**** Action ****/

export const stationAction = {
  requestStations: createAction(FETCH_STATIONS),
  openStation: createAction(OPEN_STATION),
  closeStation: createAction(CLOSE_STATION),

}
const requestStationsSuccess = createAction(FETCH_STATIONS_SUCCESS)
const openStationSuccess = createAction(OPEN_STATION_SUCCESS)
const closeStationSuccess = createAction(CLOSE_STATION_SUCCESS)

/**** Saga ****/

function* fetchStationsAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.fetchStations, payload)
  let stations = []
  let stationList = []
  if(data.success){
    if(data.stations&&data.stations.length>0){
      data.stations.forEach((item)=>{
        stationList.push(item.id)
        stations.push(StationDetail.fromApi(item))
      })
    }
    yield put(requestStationsSuccess({stations: stations, stationList: stationList}))
    if(payload.success){
      payload.success()
    }
  }else{
    if(payload.error){
      payload.error(data.error)
    }
  }
}

function* openStationAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.openStation, payload)
  if(data.success){
    if(data.station){
      yield put(openStationSuccess({station: StationDetail.fromApi(data.station)}))
      if(payload.success){
        payload.success()
      }
    }
  }else{
    if(payload.error){
      payload.error(data.error)
    }
  }
}

function* closeStationAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.closeStation, payload)
  if(data.success){
    if(data.station){
      yield put(closeStationSuccess({station: StationDetail.fromApi(data.station)}))
      if(payload.success){
        payload.success()
      }
    }
  }else{
    if(payload.error){
      payload.error(data.error)
    }
  }
}

export const stationSaga = [
  takeEvery(FETCH_STATIONS, fetchStationsAction),
  takeEvery(OPEN_STATION, openStationAction),
  takeEvery(CLOSE_STATION, closeStationAction),


]

/**** Reducer ****/

const initialState = StationRecord()

export function stationReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_STATIONS_SUCCESS:
      return handleSaveStations(state, action)
    case OPEN_STATION_SUCCESS:
      return handleSaveStation(state, action)
    case CLOSE_STATION_SUCCESS:
      return handleSaveStation(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
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

function handleSaveStation(state, action) {
  let station = action.payload.station
    state = state.setIn(['allStations', station.id], station)
  return state
}

function handleSetAllPartners(state, partners) {
  partners.forEach((item)=> {
    state = state.setIn(['allPartners', item.id], item)
  })
  return state
}

function handleSetAllInvestors(state, investors) {
  investors.forEach((item)=> {
    state = state.setIn(['allInvestors', item.id], item)
  })
  return state
}

function handleSaveStations(state, action) {
  let stations = action.payload.stations
  let stationList = action.payload.stationList
  if(stationList&&stationList.length>0){
    state = state.set('stationList', new List(stationList))
    state = handleSetAllStations(state,stations)
  }
  return state
}



function onRehydrate(state, action) {
  var incoming = action.payload.STATION
  if (!incoming) return state

  // let allStations = incoming.allStations
  // if (allStations) {
  //   state = state.set('allStations', allStations)
  // }

  return state
}

/**** Selector ****/

function selectStations(state) {
  let station = state.STATION
  let stationList = station.stationList
  let stations = []
  if(stationList&&stationList.size>0){
    stationList.forEach((item)=>{
      let stationInfo = station.getIn(['allStations',item])
      stations.push(stationInfo.toJS())
    })
  }
  return stations
}



export const stationSelector = {
  selectStations,

}