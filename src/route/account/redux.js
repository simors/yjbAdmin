/**
 * Created by lilu on 2017/10/14.
 */

import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import * as accountFunc from './cloud'
import {stationAction,StationDetail,stationSelector} from '../station/redux'
import {formatLeancloudTime} from '../../util/datetime'
/****  Model  ****/

export const AccountRecord = Record({
  stationAccountList: List(),
  stationAccountsDetailList: List(),
  allStationAccounts: Map(),
  allPartnerAccounts: Map(),
  allInvestorAccounts: Map(),
  partnerAccountList: List(),
  investorAccountList: List(),
  partnerAccountsDetailList: List(),
  investorAccountsDetailList: List(),
}, "StationRecord")

export const StationAccountRecord = Record({
  id: undefined,
  accountDay: undefined,
  profit: undefined,
  cost: undefined,
  platformProfit: undefined,
  incoming: undefined,
  partnerProfit: undefined,
  investorProfit: undefined,
  powerUnitPrice: undefined,
  stationId: undefined,
  createdAt: undefined,
}, 'StationAccountRecord')

export class StationAccount extends StationAccountRecord {
  static fromApi(obj) {
    // console.log('obj====>', obj)
    let stationDetail = new StationAccountRecord()
    return stationDetail.withMutations((record) => {
      record.set('id', obj.id)
      record.set('accountDay', formatLeancloudTime(new Date(obj.accountDay),'YYYY-MM-DD'))
      record.set('profit', obj.profit)
      record.set('platformProfit', obj.platformProfit)
      record.set('cost', obj.cost)
      record.set('partnerProfit', obj.partnerProfit)
      record.set('investorProfit', obj.investorProfit)
      record.set('incoming', obj.incoming)
      record.set('powerUnitPrice', obj.powerUnitPrice)
      record.set('stationId', obj.stationId)
      record.set('createdAt', obj.createdAt)
    })
  }
}

export const SharingAccountRecord = Record({
  id: undefined,
  accountDay: undefined,
  profit: undefined,
  stationId: undefined,
  userId: undefined,

}, 'SharingAccountRecord')

export class SharingAccount extends SharingAccountRecord {
  static fromApi(obj) {
    // console.log('obj====>', obj)
    let stationDetail = new SharingAccountRecord()
    return stationDetail.withMutations((record) => {
      record.set('id', obj.id)
      record.set('accountDay', formatLeancloudTime(new Date(obj.accountDay),'YYYY-MM-DD'))
      record.set('profit', obj.profit)
      record.set('stationId', obj.stationId)
      record.set('userId', obj.userId)
    })
  }
}
/**** Constant ****/

const FETCH_STATION_ACCOUNT = 'FETCH_STATION_ACCOUNT'
const FETCH_STATION_ACCOUNT_SUCCESS = 'FETCH_STATION_ACCOUNT_SUCCESS'
const FETCH_PARTNER_ACCOUNT = 'FETCH_PARTNER_ACCOUNT'
const FETCH_PARTNER_ACCOUNT_SUCCESS = 'FETCH_PARTNER_ACCOUNT_SUCCESS'
const FETCH_INVESTOR_ACCOUNT = 'FETCH_INVESTOR_ACCOUNT'
const FETCH_INVESTOR_ACCOUNT_SUCCESS = 'FETCH_INVESTOR_ACCOUNT_SUCCESS'
const FETCH_STATION_ACCOUNT_DETAIL = 'FETCH_STATION_ACCOUNT_DETAIL'
const FETCH_STATION_ACCOUNT_DETAIL_SUCCESS = 'FETCH_STATION_ACCOUNT_DETAIL_SUCCESS'
const FETCH_PARTNER_ACCOUNT_DETAIL = 'FETCH_PARTNER_ACCOUNT_DETAIL'
const FETCH_PARTNER_ACCOUNT_DETAIL_SUCCESS = 'FETCH_PARTNER_ACCOUNT_DETAIL_SUCCESS'
const FETCH_INVESTOR_ACCOUNT_DETAIL = 'FETCH_INVESTOR_ACCOUNT_DETAIL'
const FETCH_INVESTOR_ACCOUNT_DETAIL_SUCCESS = 'FETCH_INVESTOR_ACCOUNT_DETAIL_SUCCESS'
/**** Action ****/

export const accountAction = {
  fetchStationAccounts: createAction(FETCH_STATION_ACCOUNT),
  fetchStationAccountsDetail: createAction(FETCH_STATION_ACCOUNT_DETAIL),
  fetchPartnerAccounts: createAction(FETCH_PARTNER_ACCOUNT),
  fetchPartnerAccountsDetail: createAction(FETCH_PARTNER_ACCOUNT_DETAIL),
  fetchInvestorAccounts: createAction(FETCH_INVESTOR_ACCOUNT),
  fetchInvestorAccountsDetail: createAction(FETCH_INVESTOR_ACCOUNT_DETAIL),
}

const fetchStationAccountsSuccess = createAction(FETCH_STATION_ACCOUNT_SUCCESS)
const fetchStationAccountsDetailSuccess = createAction(FETCH_STATION_ACCOUNT_DETAIL_SUCCESS)
const fetchPartnerAccountsSuccess = createAction(FETCH_PARTNER_ACCOUNT_SUCCESS)
const fetchPartnerAccountsDetailSuccess = createAction(FETCH_PARTNER_ACCOUNT_DETAIL_SUCCESS)
const fetchInvestorAccountsSuccess = createAction(FETCH_INVESTOR_ACCOUNT_SUCCESS)
const fetchInvestorAccountsDetailSuccess = createAction(FETCH_INVESTOR_ACCOUNT_DETAIL_SUCCESS)

/**** Saga ****/

function* fetchStationAccounts(action) {
  let payload = action.payload
  // console.log('payload=======>',payload)
  let data = yield call(accountFunc.fetchStationAccounts, payload)
  let stationAccounts = []
  let stationAccountList = []
  if (data.success) {
    // console.log('data=====>',data)
    if (data.accounts && data.accounts.length > 0) {
      data.accounts.forEach((item)=> {
        // console.log('item=====>',item)
        stationAccountList.push(item.id)
        stationAccounts.push(item)
        if(item.station){
          stationAction.saveStation({station: item.station})
        }
      })
    }
    console.log('stationAccountList======>',stationAccountList,stationAccounts)
    yield put(fetchStationAccountsSuccess({stationAccounts: stationAccounts, stationAccountList: stationAccountList}))
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* fetchStationAccountsDetail(action) {
  let payload = action.payload
  // console.log('payload=======>',payload)
  let data = yield call(accountFunc.fetchStationAccountDetail, payload)
  let stationAccounts = []
  let stationAccountList = []
  if (data.success) {
    // console.log('data=====>',data)
    if (data.accounts && data.accounts.length > 0) {
      data.accounts.forEach((item)=> {
        // console.log('item=====>',item)
        stationAccountList.push(item.id)
        stationAccounts.push(item)
        if(item.station){
          stationAction.saveStation({station: item.station})
        }
      })
    }
    console.log('stationAccountList======>',stationAccountList,stationAccounts)
    yield put(fetchStationAccountsDetailSuccess({stationAccounts: stationAccounts, stationAccountList: stationAccountList}))
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}


function* fetchPartnerAccounts(action) {
  let payload = action.payload
  // console.log('payload=======>',payload)
  let data = yield call(accountFunc.fetchPartnerAccounts, payload)
  let partnerAccounts = []
  let partnerAccountList = []
  if (data.success) {
    // console.log('data=====>',data)
    if (data.accounts && data.accounts.length > 0) {
      data.accounts.forEach((item)=> {
        // console.log('item=====>',item)
        partnerAccountList.push(item.id)
        partnerAccounts.push(item)
        if(item.station){
          stationAction.saveStation({station: item.station})
        }
      })
    }
    // console.log('stationAccountList======>',stationAccountList,stationAccounts)
    yield put(fetchPartnerAccountsSuccess({partnerAccounts: partnerAccounts, partnerAccountList: partnerAccountList}))
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* fetchPartnerAccountsDetail(action) {
  let payload = action.payload
  // console.log('payload=======>',payload)
  let data = yield call(accountFunc.fetchPartnerAccountsDetail, payload)
  let partnerAccounts = []
  let partnerAccountList = []
  if (data.success) {
    // console.log('data=====>',data)
    if (data.accounts && data.accounts.length > 0) {
      data.accounts.forEach((item)=> {
        // console.log('item=====>',item)
        partnerAccountList.push(item.id)
        partnerAccounts.push(item)
        if(item.station){
          stationAction.saveStation({station: item.station})
        }
      })
    }
    yield put(fetchPartnerAccountsDetailSuccess({partnerAccounts: partnerAccounts, partnerAccountList: partnerAccountList}))
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}


function* fetchInvestorAccounts(action) {
  let payload = action.payload
  // console.log('payload=======>',payload)
  let data = yield call(accountFunc.fetchInvestorAccounts, payload)
  let investorAccounts = []
  let investorAccountList = []
  if (data.success) {
    // console.log('data=====>',data)
    if (data.accounts && data.accounts.length > 0) {
      data.accounts.forEach((item)=> {
        // console.log('item=====>',item)
        investorAccountList.push(item.id)
        investorAccounts.push(item)
        if(item.station){
          stationAction.saveStation({station: item.station})
        }
      })
    }
    // console.log('stationAccountList======>',stationAccountList,stationAccounts)
    yield put(fetchInvestorAccountsSuccess({investorAccounts: investorAccounts, investorAccountList: investorAccountList}))
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

function* fetchInvestorAccountsDetail(action) {
  let payload = action.payload
  // console.log('payload=======>',payload)
  let data = yield call(accountFunc.fetchInvestorAccountsDetail, payload)
  let investorAccounts = []
  let investorAccountList = []
  if (data.success) {
    // console.log('data=====>',data)
    if (data.accounts && data.accounts.length > 0) {
      data.accounts.forEach((item)=> {
        // console.log('item=====>',item)
        investorAccountList.push(item.id)
        investorAccounts.push(item)
        if(item.station){
          stationAction.saveStation({station: item.station})
        }
      })
    }
    // console.log('stationAccountList======>',stationAccountList,stationAccounts)
    yield put(fetchInvestorAccountsDetailSuccess({investorAccounts: investorAccounts, investorAccountList: investorAccountList}))
    if (payload.success) {
      payload.success()
    }
  } else {
    if (payload.error) {
      payload.error(data.error)
    }
  }
}

export const accountSaga = [
  takeLatest(FETCH_STATION_ACCOUNT, fetchStationAccounts),
  takeLatest(FETCH_STATION_ACCOUNT_DETAIL, fetchStationAccountsDetail),
  takeLatest(FETCH_PARTNER_ACCOUNT, fetchPartnerAccounts),
  takeLatest(FETCH_PARTNER_ACCOUNT_DETAIL, fetchPartnerAccountsDetail),
  takeLatest(FETCH_INVESTOR_ACCOUNT, fetchInvestorAccounts),
  takeLatest(FETCH_INVESTOR_ACCOUNT_DETAIL, fetchInvestorAccountsDetail),

]

/**** Reducer ****/

const initialState = AccountRecord()

export function accountReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_STATION_ACCOUNT_SUCCESS:
      return handleSaveStationAccounts(state, action)
    case FETCH_STATION_ACCOUNT_DETAIL_SUCCESS:
      return handleSaveStationAccountsDetail(state, action)
    case FETCH_PARTNER_ACCOUNT_SUCCESS:
      return handleSavePartnerAccounts(state, action)
    case FETCH_PARTNER_ACCOUNT_DETAIL_SUCCESS:
      return handleSavePartnerAccountsDetail(state, action)
    case FETCH_INVESTOR_ACCOUNT_SUCCESS:
    return handleSaveInvestorAccounts(state, action)
    case FETCH_INVESTOR_ACCOUNT_DETAIL_SUCCESS:
      return handleSaveInvestorAccountsDetail(state, action)
    default:
      return state
  }
}

function handleSetAllStationAccounts(state, stationAccounts) {
  stationAccounts.forEach((item)=> {
    state = state.setIn(['allStationAccounts', item.id], StationAccount.fromApi(item))

  })
  return state
}

function handleSaveStationAccounts(state, action) {

  let stationAccounts = action.payload.stationAccounts
  let stationAccountList = action.payload.stationAccountList
  // console.log('stationAccounts=========>', stationAccounts, stationAccountList)
  if (stationAccountList && stationAccountList.length > 0) {
    state = state.set('stationAccountList', new List(stationAccountList))
    state = handleSetAllStationAccounts(state, stationAccounts)
  } else {
    state = state.set('stationAccountList', new List())
  }
  return state
}

function handleSaveStationAccountsDetail(state, action) {

  let stationAccounts = action.payload.stationAccounts
  let stationAccountList = action.payload.stationAccountList
  // console.log('stationAccounts=========>', stationAccounts, stationAccountList)
  if (stationAccountList && stationAccountList.length > 0) {
    state = state.set('stationAccountsDetailList', new List(stationAccountList))
    state = handleSetAllStationAccounts(state, stationAccounts)
  } else {
    state = state.set('stationAccountsDetailList', new List())
  }
  return state
}


function handleSetAllPartnerAccounts(state, stationAccounts) {
  stationAccounts.forEach((item)=> {
    state = state.setIn(['allPartnerAccounts', item.id], SharingAccount.fromApi(item))

  })
  return state
}

function handleSavePartnerAccounts(state, action) {

  let partnerAccounts = action.payload.partnerAccounts
  let partnerAccountList = action.payload.partnerAccountList
  // console.log('stationAccounts=========>', stationAccounts, stationAccountList)
  if (partnerAccountList && partnerAccountList.length > 0) {
    state = state.set('partnerAccountList', new List(partnerAccountList))
    state = handleSetAllPartnerAccounts(state, partnerAccounts)
  } else {
    state = state.set('partnerAccountList', new List())
  }
  return state
}

function handleSavePartnerAccountsDetail(state, action) {

  let partnerAccounts = action.payload.partnerAccounts
  let partnerAccountList = action.payload.partnerAccountList
  if (partnerAccountList && partnerAccountList.length > 0) {
    state = state.set('partnerAccountsDetailList', new List(partnerAccountList))
    state = handleSetAllPartnerAccounts(state, partnerAccounts)
  } else {
    state = state.set('partnerAccountsDetailList', new List())
  }
  return state
}


function handleSetAllInvestorAccounts(state, stationAccounts) {
  stationAccounts.forEach((item)=> {
    state = state.setIn(['allInvestorAccounts', item.id], SharingAccount.fromApi(item) )

  })
  return state
}

function handleSaveInvestorAccounts(state, action) {

  let investorAccounts = action.payload.investorAccounts
  let investorAccountList = action.payload.investorAccountList
  if (investorAccountList && investorAccountList.length > 0) {
    state = state.set('investorAccountList', new List(investorAccountList))
    state = handleSetAllInvestorAccounts(state, investorAccounts)
  } else {
    state = state.set('investorAccountList', new List())
  }
  return state
}

function handleSaveInvestorAccountsDetail(state, action) {

  let investorAccounts = action.payload.investorAccounts
  let investorAccountList = action.payload.investorAccountList

  if (investorAccountList && investorAccountList.length > 0) {
    state = state.set('investorAccountsDetailList', new List(investorAccountList))
    state = handleSetAllInvestorAccounts(state, investorAccounts)
  } else {
    state = state.set('investorAccountsDetailList', new List())
  }
  return state
}


/**** Selector ****/

function selectStationAccounts(state) {
  let account = state.ACCOUNT
  let stationAccountList = account.stationAccountList
  let stationAccounts = []
  if (stationAccountList && stationAccountList.size > 0) {
    stationAccountList.forEach((item)=> {
      let accountInfo = account.getIn(['allStationAccounts', item])
      if(accountInfo){
        let station = stationSelector.selectStationById(state,accountInfo.stationId)
        accountInfo?accountInfo = accountInfo.toJS(): undefined
        station?accountInfo.station = station: null
        // console.log('accountInfo====>',accountInfo)
        stationAccounts.push(accountInfo)
      }
    })
  }
  return stationAccounts
}

function selectStationAccountsDetail(state) {
  let account = state.ACCOUNT
  let stationAccountList = account.stationAccountsDetailList
  let stationAccounts = []
  if (stationAccountList && stationAccountList.size > 0) {
    stationAccountList.forEach((item)=> {
      let accountInfo = account.getIn(['allStationAccounts', item])
      if(accountInfo){
        let station = stationSelector.selectStationById(state,accountInfo.stationId)
        accountInfo?accountInfo = accountInfo.toJS(): undefined
        station?accountInfo.station = station: null
        // console.log('accountInfo====>',accountInfo)
        stationAccounts.push(accountInfo)
      }
    })
  }
  return stationAccounts
}

function selectPartnerAccounts(state) {
  let account = state.ACCOUNT
  let partnerAccountList = account.partnerAccountList
  let partnerAccounts = []
  if (partnerAccountList && partnerAccountList.size > 0) {
    partnerAccountList.forEach((item)=> {
      let accountInfo = account.getIn(['allPartnerAccounts', item])
      if(accountInfo){
        let station = stationSelector.selectStationById(state,accountInfo.stationId)
        accountInfo?accountInfo = accountInfo.toJS(): undefined
        station?accountInfo.station = station: null
        // console.log('accountInfo====>',accountInfo)
        partnerAccounts.push(accountInfo)
      }
    })
  }
  return partnerAccounts
}

function selectPartnerAccountsDetail(state) {
  let account = state.ACCOUNT
  let partnerAccountsDetailList = account.partnerAccountsDetailList
  let partnerAccounts = []
  if (partnerAccountsDetailList && partnerAccountsDetailList.size > 0) {
    partnerAccountsDetailList.forEach((item)=> {
      let accountInfo = account.getIn(['allPartnerAccounts', item])
      if(accountInfo){
        let station = stationSelector.selectStationById(state,accountInfo.stationId)
        accountInfo?accountInfo = accountInfo.toJS(): undefined
        station?accountInfo.station = station: null
        // console.log('accountInfo====>',accountInfo)
        partnerAccounts.push(accountInfo)
      }
    })
  }
  return partnerAccounts
}
function selectInvestorAccounts(state) {
  let account = state.ACCOUNT
  let investorAccountList = account.investorAccountList
  let investorAccounts = []
  if (investorAccountList && investorAccountList.size > 0) {
    investorAccountList.forEach((item)=> {
      let accountInfo = account.getIn(['allInvestorAccounts', item])
      if(accountInfo){
        let station = stationSelector.selectStationById(state,accountInfo.stationId)
        accountInfo?accountInfo = accountInfo.toJS(): undefined
        station?accountInfo.station = station: null
        // console.log('accountInfo====>',accountInfo)
        investorAccounts.push(accountInfo)
      }
    })
  }
  return investorAccounts
}

function selectInvestorAccountsDetail(state) {
  let account = state.ACCOUNT
  let investorAccountsDetailList = account.investorAccountsDetailList
  let investorAccounts = []
  if (investorAccountsDetailList && investorAccountsDetailList.size > 0) {
    investorAccountsDetailList.forEach((item)=> {
      let accountInfo = account.getIn(['allInvestorAccounts', item])
      if(accountInfo){
        let station = stationSelector.selectStationById(state,accountInfo.stationId)
        accountInfo?accountInfo = accountInfo.toJS(): undefined
        station?accountInfo.station = station: null
        investorAccounts.push(accountInfo)
      }
    })
  }
  return investorAccounts
}
export const accountSelector = {
  selectStationAccounts,
  selectStationAccountsDetail,
  selectPartnerAccounts,
  selectPartnerAccountsDetail,
  selectInvestorAccounts,
  selectInvestorAccountsDetail,

}
