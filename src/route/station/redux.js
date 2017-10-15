/**
 * Created by lilu on 2017/9/18.
 */

import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
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
  userList: List()
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
  deviceNo: undefined,
  createdAt: undefined,
}, 'StationDetailRecord')

export class StationDetail extends StationDetailRecord {
  static fromApi(obj) {
    console.log('obj====>', obj)
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
      record.set('adminName', obj.adminName ? obj.adminName : (obj.admin?obj.admin.nickname:undefined))
      record.set('adminPhone', obj.adminPhone ? obj.adminPhone : (obj.admin?obj.admin.mobilePhoneNumber:undefined))
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
  shareholderName: undefined,
  shareholderPhone: undefined,
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
      record.set('shareholderName', obj.shareholderName)
      record.set('shareholderPhone', obj.shareholderPhone)
      record.set('stationId', obj.stationId)
      record.set('stationName', obj.stationName)
      record.set('createdAt', obj.createdAt)
      record.set('status', obj.status)
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
const TEST_FETCH_USER = 'TEST_FETCH_USER'
const TEST_FETCH_USER_SUCCESS = 'TEST_FETCH_USER_SUCCESS'

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
  updateStation: createAction(UPDATE_STATION),
  testFetchUsers: createAction(TEST_FETCH_USER),
  saveStation: createAction(CREATE_STATION_SUCCESS)
}

const requestStationsSuccess = createAction(FETCH_STATIONS_SUCCESS)
const openStationSuccess = createAction(OPEN_STATION_SUCCESS)
const closeStationSuccess = createAction(CLOSE_STATION_SUCCESS)
const requestInvestorsSuccess = createAction(FETCH_INVESTORS_SUCCESS)
const requestPartnersSuccess = createAction(FETCH_PARTNERS_SUCCESS)
const createStationSuccess = createAction(CREATE_STATION_SUCCESS)
const updateStationSuccess = createAction(UPDATE_STATION_SUCCESS)
const testUsersSuccess = createAction(TEST_FETCH_USER_SUCCESS)


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

function* openStationAction(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.openStation, payload)
  if (data.success) {
    if (data.station) {
      yield put(openStationSuccess({station: StationDetail.fromApi(data.station)}))
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
      yield put(closeStationSuccess({station: StationDetail.fromApi(data.station)}))
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
  if (data.success) {
    if (data.investors && data.investors.length > 0) {
      data.investors.forEach((item)=> {
        investorList.push(item.id)
        investors.push(ProfitSharing.fromApi(item))
      })
    }
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
  console.log('actionpayload=====>', payload)
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
  if (data.success) {
    if (data.partners && data.partners.length > 0) {
      data.partners.forEach((item)=> {
        partnerList.push(item.id)
        partners.push(ProfitSharing.fromApi(item))
      })
    }
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
    let station = StationDetail.fromApi(data.station)
    yield put(createStationSuccess({station: station}))
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
    let station = StationDetail.fromApi(data.station)
    yield put(updateStationSuccess({station: station}))
    if (payload.success) {
      payload.success(station.id)
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* testFetchUserList(action) {
  let payload = action.payload
  let data = yield call(stationFuncs.testUserList, payload)

  if (data.success) {
    yield put(testUsersSuccess({users: data.userList}))
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
  takeLatest(TEST_FETCH_USER, testFetchUserList),


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
    case TEST_FETCH_USER_SUCCESS:
      return handleSaveUsers(state, action)
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
  console.log('stations=========>', stations, stationList)
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


function handleSaveUsers(state, action) {
  let users = action.payload.users
  state = state.set('userList', new List(users))
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
      let stationInfo = station.getIn(['allStations', item])
      stations.push(stationInfo.toJS())
    })
  }
  return stations
}

function selectStation(state, stationId) {
  let station = state.STATION
  // console.log('stationId=====>',stationId)
  let stationInfo = station.getIn(['allStations', stationId])
  // console.log('stationInfo==>',stationInfo)
  return stationInfo
}

function selectInvestors(state) {
  let station = state.STATION
  let investorList = station.investorList
  let investors = []
  if (investorList && investorList.size > 0) {
    investorList.forEach((item)=> {
      let investorInfo = station.getIn(['allInvestors', item])
      investors.push(investorInfo.toJS())
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
      let partnerInfo = station.getIn(['allPartners', item])
      partners.push(partnerInfo.toJS())
    })
  }
  return partners
}

function selectUsers(state) {
  let station = state.STATION
  let partnerList = station.userList

  return partnerList.toJS() || []
}

function selectStationById(state, stationId) {
  let station = state.STATION
  let stationRecord = station.getIn(['allStations', stationId])

  return stationRecord ? stationRecord.toJS() : undefined
}


export const stationSelector = {
  selectStations,
  selectInvestors,
  selectStation,
  selectPartners,
  selectStationById,
  selectUsers
}
