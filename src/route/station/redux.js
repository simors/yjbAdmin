/**
 * Created by lilu on 2017/9/18.
 */

import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import {action as authAction, selector} from '../../util/auth'
import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import * as stationFuncs from './cloud'

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
  status: undefined,
  deviceNo: undefined,
  createdAt: undefined,
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
      record.set('adminId', obj.adminId ? obj.adminId : obj.admin.id)
      record.set('status', obj.status)
      record.set('deviceNo', obj.deviceNo)
      record.set('createdAt', obj.createdAt)

    })
  }
}

export const ProfitSharingRecord = Record({
  id: undefined,
  type: undefined,
  royalty: undefined,
  investment: undefined,
  shareholderId: undefined,
  stationId: undefined,
  stationName: undefined,
  createdAt: undefined,
  status: undefined
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
      record.set('stationId', obj.stationId)
      record.set('stationName', obj.stationName)
      record.set('createdAt', obj.createdAt)
      record.set('status', obj.status)
    })
  }
}


/**** Constant ****/

export const PROFIT_SHARE_TYPE = {
  INVESTOR_SHARE_TYPE: 'investor',
  PARTNER_SHARE_TYPE: 'partner',
}

const FETCH_STATIONS = 'FETCH_STATIONS'
const FETCH_STATIONS_SUCCESS = 'FETCH_STATIONS_SUCCESS'
const OPEN_STATION = 'OPEN_STATION'
const OPEN_STATION_SUCCESS = 'OPEN_STATION_SUCCESS'
const CLOSE_STATION = 'CLOSE_STATION'
const CLOSE_STATION_SUCCESS = 'CLOSE_STATION_SUCCESS'
const CREATE_STATION = 'CREATE_STATION'
const CREATE_STATION_SUCCESS = 'CREATE_STATION_SUCCESS'
const UPDATE_STATION = 'UPDATE_STATION'
const UPDATE_STATION_SUCCESS = 'UPDATE_STATION_SUCCESS'
const FETCH_INVESTORS = 'FETCH_INVESTORS'
const FETCH_INVESTORS_SUCCESS = 'FETCH_INVESTORS_SUCCESS'
const OPEN_INVESTOR = 'OPEN_INVESTOR'
const CLOSE_INVESTOR = 'CLOSE_INVESTOR'
const CREATE_INVESTOR = 'CREATE_INVESTOR'
const UPDATE_INVESTOR = 'UPDATE_INVESTOR'
const FETCH_PARTNERS = 'FETCH_PARTNERS'
const FETCH_PARTNERS_SUCCESS = 'FETCH_PARTNERS_SUCCESS'
const CREATE_PARTNER = 'CREATE_PARTNER'
const UPDATE_PARTNER = 'UPDATE_PARTNER'
const OPEN_PARTNER = 'OPEN_PARTNER'
const CLOSE_PARTNER = 'CLOSE_PARTNER'
const SAVE_STATIONS = 'SAVE_STATIONS'
const SAVE_PROFIT_SHARE = 'SAVE_PROFIT_SHARE'
const SAVE_BATCH_PROFIT_SHARE = 'SAVE_BATCH_PROFIT_SHARE'
const VALID_ADMIN_HAVE_STATION = 'VALID_ADMIN_HAVE_STATION'
const VALID_INVESTOR_HAVE_STATION = 'VALID_INVESTOR_HAVE_STATION'
const VALID_PARTNER_HAVE_STATION = 'VALID_PARTNER_HAVE_STATION'

/**** Action ****/

export const stationAction = {
  requestStations: createAction(FETCH_STATIONS),
  openStation: createAction(OPEN_STATION),
  closeStation: createAction(CLOSE_STATION),
  createStation: createAction(CREATE_STATION),
  updateStation: createAction(UPDATE_STATION),
  requestInvestors: createAction(FETCH_INVESTORS),
  openInvestor: createAction(OPEN_INVESTOR),
  closeInvestor: createAction(CLOSE_INVESTOR),
  createInvestor: createAction(CREATE_INVESTOR),
  updateInvestor: createAction(UPDATE_INVESTOR),
  requestPartners: createAction(FETCH_PARTNERS),
  createPartner: createAction(CREATE_PARTNER),
  updatePartner: createAction(UPDATE_PARTNER),
  openPartner: createAction(OPEN_PARTNER),
  closePartner: createAction(CLOSE_PARTNER),
  saveStation: createAction(CREATE_STATION_SUCCESS),
  saveStations: createAction(SAVE_STATIONS),
  saveProfitShare: createAction(SAVE_PROFIT_SHARE),
  saveBatchProfitShare: createAction(SAVE_BATCH_PROFIT_SHARE),
  validAdminHaveNoStation: createAction(VALID_ADMIN_HAVE_NO_STATION),// payload:{userId: Str,success: Func, error: Func}
  validPartnerHaveNoStation: createAction(VALID_PARTNER_HAVE_NO_STATION),// payload:{userId: Str,success: Func, error: Func}
  validInvestorHaveNoStation: createAction(VALID_INVESTOR_HAVE_NO_STATION)// payload:{userId: Str,success: Func, error: Func}

}

const requestStationsSuccess = createAction(FETCH_STATIONS_SUCCESS)
const openStationSuccess = createAction(OPEN_STATION_SUCCESS)
const closeStationSuccess = createAction(CLOSE_STATION_SUCCESS)
const requestInvestorsSuccess = createAction(FETCH_INVESTORS_SUCCESS)
const requestPartnersSuccess = createAction(FETCH_PARTNERS_SUCCESS)
const createStationSuccess = createAction(CREATE_STATION_SUCCESS)
const updateStationSuccess = createAction(UPDATE_STATION_SUCCESS)


/**** Saga ****/

function* fetchStationsAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.fetchStations, payload)
  let stations = []
  let stationList = []
  let users = new Set()
  if (data.success) {
    if (data.stations && data.stations.length > 0) {
      for (let i = 0; i < data.stations.length; i++) {
        let item = data.stations[i]
        stationList.push(item.id)
        stations.push(item)
        if (item.admin) {
          users.add(item.admin)
        }
      }
    }
    yield put(authAction.saveUsers({users: users}))
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

function* openStationAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.openStation, payload)
  if (data.success) {
    if (data.station) {
      yield put(openStationSuccess({station: data.station}))
      if (data.station.admin) {
        yield put(authAction.saveUser({user: data.station.admin}))
      }
      if (payload.success) {
        payload.success()
      }
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* closeStationAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.closeStation, payload)
  if (data.success) {
    if (data.station) {
      yield put(closeStationSuccess({station: data.station}))
      if (data.station.admin) {
        yield put(authAction.saveUser({user: data.station.admin}))

      }
      if (payload.success) {
        payload.success()
      }
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* fetchInvestorsAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.fetchInvestor, payload)
  let investors = []
  let investorList = []
  let users = new Set()
  let stations = new Set()
  if (data.success) {
    if (data.investors && data.investors.length > 0) {
      for (let i = 0; i < data.investors.length; i++) {
        let item = data.investors[i]
        investorList.push(item.id)
        investors.push(item)
        if (item.shareholder) {
          users.add(item.shareholder)
        }
        if (item.station) {
          stations.add(item.station)
        }
      }
    }
    yield put(authAction.saveUsers({users: users}))
    yield put(stationAction.saveStations({stations: stations}))

    yield put(requestInvestorsSuccess({investors: investors, investorList: investorList}))
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* openInvestorsAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.openInvestor, payload)
  if (data.success) {
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* closeInvestorsAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.closeInvestor, payload)
  if (data.success) {
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* createInvestorsAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.createInvestor, payload)
  if (data.success) {
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* updateInvestorsAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.updateInvestor, payload)
  if (data.success) {
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* fetchPartnersAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.fetchProfitSharing, payload)
  let partners = []
  let partnerList = []
  let users = new Set()
  let stations = new Set()
  if (data.success) {
    if (data.partners && data.partners.length > 0) {
      for (let i = 0; i < data.partners.length; i++) {
        let item = data.partners[i]
        partnerList.push(item.id)
        partners.push(item)
        if (item.shareholder) {
          users.add(item.shareholder)
        }
        if (item.station) {
          stations.add(item.station)
        }
      }
    }
    yield put(authAction.saveUsers({users: users}))
    yield put(stationAction.saveStations({stations: stations}))
    yield put(requestPartnersSuccess({partners: partners, partnerList: partnerList}))
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* createPartnerAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.createPartner, payload)
  if (data.success) {
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* updatePartnerAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.updatePartner, payload)
  if (data.success) {
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* openPartnerAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.openPartner, payload)
  if (data.success) {
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* closePartnerAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.closePartner, payload)
  if (data.success) {
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* createStationAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.createStation, payload)

  if (data.success) {
    let station = data.station
    yield put(createStationSuccess({station: station}))
    if (station.admin) {
      yield put(authAction.saveUser({user: station.admin}))
    }
    if (payload.success) {
      payload.success(station.id)
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* updateStationAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.updateStation, payload)

  if (data.success) {
    let station = data.station
    yield put(updateStationSuccess({station: station}))
    if (station.admin) {
      yield put(authAction.saveUser({user: station.admin}))
    }
    if (payload.success) {
      payload.success(station.id)
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

/**
 * 查询服务点管理员是否还拥有服务点
 * @param action
 * payload = {
 * userId,
 * success(),
 * error()
 * * return 有返回error，没有返回true
 */
function* sagaValidAdminHaveNoStation(action) {
  let payload = action.payload
  try{
    yield call(stationFuncs.adminHaveStation, payload)
    if(payload.success){
      payload.success()
    }
  }catch (err){
    if(payload.error){
      payload.error(err)
    }
  }
}

/**
 * 查询分成方是否还拥有服务点
 * @param action
 * payload = {
 * userId,
 * success(),
 * error()
 * return 有返回error，没有返回true
 *
 */
function* sagaValidPartnerHaveNoStation(action) {
  let payload = action.payload
  try{
    yield call(stationFuncs.partnerHaveStation, payload)
    if(payload.success){
      payload.success()
    }
  }catch (err){
    if(payload.error){
      payload.error(err)
    }
  }
}

/**
 * 查询投资人是否还拥有服务点
 * @param action
 * payload = {
 * userId,
 * success(),
 * error()
 * * return 有返回error，没有返回true
 */
function* sagaValidInvestorHaveNoStation(action) {
  let payload = action.payload
  try{
    yield call(stationFuncs.investorHaveStation, payload)
    if(payload.success){
      payload.success()
    }
  }catch (err){
    if(payload.error){
      payload.error(err)
    }
  }
}


export const stationSaga = [
  takeLatest(FETCH_STATIONS, fetchStationsAction),
  takeLatest(OPEN_STATION, openStationAction),
  takeLatest(CLOSE_STATION, closeStationAction),
  takeLatest(FETCH_INVESTORS, fetchInvestorsAction),
  takeLatest(OPEN_INVESTOR, openInvestorsAction),
  takeLatest(CLOSE_INVESTOR, closeInvestorsAction),
  takeLatest(CREATE_INVESTOR, createInvestorsAction),
  takeLatest(UPDATE_INVESTOR, updateInvestorsAction),
  takeLatest(FETCH_PARTNERS, fetchPartnersAction),
  takeLatest(CREATE_PARTNER, createPartnerAction),
  takeLatest(UPDATE_PARTNER, updatePartnerAction),
  takeLatest(OPEN_PARTNER, openPartnerAction),
  takeLatest(CLOSE_PARTNER, closePartnerAction),
  takeLatest(CREATE_STATION, createStationAction),
  takeLatest(UPDATE_STATION, updateStationAction),
  takeLatest(VALID_ADMIN_HAVE_NO_STATION, sagaValidAdminHaveNoStation),
  takeLatest(VALID_PARTNER_HAVE_NO_STATION, sagaValidPartnerHaveNoStation),
  takeLatest(VALID_INVESTOR_HAVE_NO_STATION, sagaValidInvestorHaveNoStation),



]

/**** Reducer ****/

const initialState = StationRecord()

export function stationReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_STATIONS_SUCCESS:
      return handleSaveStations(state, action)
    case CREATE_STATION_SUCCESS:
      return handleSaveStation(state, action)
    case UPDATE_STATION_SUCCESS:
      return handleSaveStation(state, action)
    case OPEN_STATION_SUCCESS:
      return handleSaveStation(state, action)
    case CLOSE_STATION_SUCCESS:
      return handleSaveStation(state, action)
    case FETCH_INVESTORS_SUCCESS:
      return handleSaveInvestors(state, action)
    case FETCH_PARTNERS_SUCCESS:
      return handleSavePartners(state, action)
    case SAVE_STATIONS:
      return handleSaveAllStations(state, action)
    case SAVE_PROFIT_SHARE:
      return handleSaveProfitShare(state, action)
    case SAVE_BATCH_PROFIT_SHARE:
      return handleSaveBatchProfitShare(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSaveAllStations(state, action) {
  let stations = action.payload.stations
  stations.forEach((item)=> {
    state = state.setIn(['allStations', item.id], StationDetail.fromApi(item))
  })
  return state
}

function handleSetAllStations(state, stations) {
  stations.forEach((item)=> {
    state = state.setIn(['allStations', item.id], StationDetail.fromApi(item))
  })
  return state
}

function handleSaveStation(state, action) {
  let station = action.payload.station
  state = state.setIn(['allStations', station.id], StationDetail.fromApi(station))
  return state
}

function handleSetAllPartners(state, partners) {
  partners.forEach((item)=> {
    state = state.setIn(['allPartners', item.id], ProfitSharing.fromApi(item))
  })
  return state
}

function handleSetAllInvestors(state, investors) {
  investors.forEach((item)=> {
    state = state.setIn(['allInvestors', item.id], ProfitSharing.fromApi(item))
  })
  return state
}

function handleSaveStations(state, action) {
  let stations = action.payload.stations
  let stationList = action.payload.stationList
  // console.log('stations=========>', stations, stationList)
  if (stationList && stationList.length > 0) {
    state = state.set('stationList', new List(stationList))
    state = handleSetAllStations(state, stations)
  } else {
    state = state.set('stationList', new List())
  }
  return state
}

function handleSaveInvestors(state, action) {
  let investors = action.payload.investors
  let investorList = action.payload.investorList
  if (investorList && investorList.length > 0) {
    state = state.set('investorList', new List(investorList))
    state = handleSetAllInvestors(state, investors)
  } else {
    state = state.set('investorList', new List())
  }
  return state
}

function handleSavePartners(state, action) {
  let partners = action.payload.partners
  let partnerList = action.payload.partnerList
  if (partnerList && partnerList.length > 0) {
    state = state.set('partnerList', new List(partnerList))
    state = handleSetAllPartners(state, partners)
  } else {
    state = state.set('partnerList', new List())
  }
  return state
}

function handleSaveProfitShare(state, action) {
  let payload = action.payload
  let type = payload.type
  let profitShare = payload.profitShare
  let station = profitShare.station
  if (type === PROFIT_SHARE_TYPE.INVESTOR_SHARE_TYPE) {
    state = state.setIn(['allInvestors', profitShare.id], ProfitSharing.fromApi(profitShare))
  } else if (type === PROFIT_SHARE_TYPE.PARTNER_SHARE_TYPE) {
    state = state.setIn(['allPartners', profitShare.id], ProfitSharing.fromApi(profitShare))
  }
  state = state.setIn(['allStations', station.id], StationDetail.fromApi(station))
  return state
}

function handleSaveBatchProfitShare(state, action) {
  let payload = action.payload
  let type = payload.type
  let profitShares = payload.profitShares
  let stations = []
  profitShares.forEach((share) => {
    stations.push(share.station)
  })
  if (type === PROFIT_SHARE_TYPE.INVESTOR_SHARE_TYPE) {
    state = handleSetAllInvestors(state, profitShares)
  } else if (type === PROFIT_SHARE_TYPE.PARTNER_SHARE_TYPE) {
    state = handleSetAllPartners(state, profitShares)
  }
  state = handleSetAllStations(state, stations)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.STATION
  if (!incoming) return state

  let allStations = Map(incoming.allStations)
  allStations.map((value, key)=> {
    if (value && key) {
      let commentInfo = StationDetail.fromApi(value)
      state = state.setIn(['allStations', key], commentInfo)
    }
  })
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
  if (stationList && stationList.size > 0) {
    stationList.forEach((item)=> {
      let stationRecord = station.getIn(['allStations', item])
      let stationInfo = stationRecord.toJS()
      if (stationInfo) {
        let admin = selector.selectUserById(state, stationInfo.adminId)
        admin ? stationInfo.admin = admin : null
      }
      stations.push(stationInfo)
    })
  }
  return stations
}

function selectStation(state, stationId) {
  if (!stationId) {
    return undefined
  }
  let station = state.STATION
  let stationRecord = station.getIn(['allStations', stationId])
  let stationInfo = stationRecord ? stationRecord.toJS() : undefined
  if (stationInfo) {
    let admin = selector.selectUserById(state, stationInfo.adminId)
    admin ? stationInfo.admin = admin : null
  }
  return stationInfo
}

function selectInvestors(state) {
  let station = state.STATION
  let investorList = station.investorList
  let investors = []
  if (investorList && investorList.size > 0) {
    investorList.forEach((item)=> {
      let investorRecord = station.getIn(['allInvestors', item])
      let investorInfo = investorRecord ? investorRecord.toJS() : undefined
      if (investorInfo) {
        let shareholder = selector.selectUserById(state, investorInfo.shareholderId)
        shareholder ? investorInfo.shareholder = shareholder : null
        let station = stationSelector.selectStationById(state,investorInfo.stationId)
        station? investorInfo.station = station: null
      }
      investors.push(investorInfo)
    })
  }
  return investors
}

function selectPartners(state) {
  let station = state.STATION
  let partnerList = station.partnerList
  let partners = []
  if (partnerList && partnerList.size > 0) {
    partnerList.forEach((item)=> {
      let partnerRecord = station.getIn(['allPartners', item])
      let partnerInfo = partnerRecord ? partnerRecord.toJS() : undefined
      if (partnerInfo) {
        let shareholder = selector.selectUserById(state, partnerInfo.shareholderId)
        shareholder ? partnerInfo.shareholder = shareholder : null
      }
      partners.push(partnerInfo)
    })
  }
  return partners
}

function selectStationById(state, stationId) {
  if (!stationId) {
    return undefined
  }
  let station = state.STATION
  let stationRecord = station.getIn(['allStations', stationId])
  let stationInfo = stationRecord ? stationRecord.toJS() : undefined
  if (stationInfo) {
    let admin = selector.selectUserById(state, stationInfo.adminId)
    admin ? stationInfo.admin = admin : null
  }
  return stationInfo
}

function selectInvestorById(state, id) {
  let investor = state.STATION.getIn(['allInvestors', id])
  if (!investor) {
    return undefined
  }
  let retInvestor = investor.toJS()
  retInvestor.station = selectStationById(state, retInvestor.stationId)
  retInvestor.stationName = retInvestor.station.name
  return retInvestor
}

function selectPartnerById(state, id) {
  let partner = state.STATION.getIn(['allPartners', id])
  if (!partner) {
    return undefined
  }
  let retPartner = partner.toJS()
  retPartner.station = selectStationById(state, retPartner.stationId)
  retPartner.stationName = retPartner.station.name
  return retPartner
}

export const stationSelector = {
  selectStations,
  selectInvestors,
  selectStation,
  selectPartners,
  selectStationById,
  selectInvestorById,
  selectPartnerById,
}
