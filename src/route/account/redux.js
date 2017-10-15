/**
 * Created by lilu on 2017/10/14.
 */

import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import * as accountFunc from './cloud'
import {stationAction,StationDetail} from '../station/redux'
import {formatLeancloudTime} from '../../util/datetime'
/****  Model  ****/

export const AccountRecord = Record({
  stationAccountList: List(),
  allStationAccounts: Map(),
  allPartnerAccounts: Map(),
  allInvestorAccounts: Map(),
  partnerAccountList: List(),
  investorAccountList: List(),
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
    console.log('obj====>', obj)
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
    console.log('obj====>', obj)
    let stationDetail = new StationAccountRecord()
    return stationDetail.withMutations((record) => {
      record.set('id', obj.id)
      record.set('accountDay', obj.accountDay)
      record.set('profit', obj.profit)
      record.set('stationId', obj.stationId)
      record.set('userId', obj.userId)
    })
  }
}
/**** Constant ****/

const FETCH_STATION_ACCOUNT = 'FETCH_STATION_ACCOUNT'
const FETCH_STATION_ACCOUNT_SUCCESS = 'FETCH_STATION_ACCOUNT_SUCCESS'

const FETCH_STATION_ACCOUNT_DETAIL = 'FETCH_STATION_ACCOUNT_DETAIL'
const FETCH_STATION_ACCOUNT_DETAIL_SUCCESS = 'FETCH_STATION_ACCOUNT_DETAIL_SUCCESS'
/**** Action ****/

export const accountAction = {
  fetchStationAccounts: createAction(FETCH_STATION_ACCOUNT),
  fetchStationAccountsDetail: createAction(FETCH_STATION_ACCOUNT_DETAIL),
}

const fetchStationAccountsSuccess = createAction(FETCH_STATION_ACCOUNT_SUCCESS)
const fetchStationAccountsDetailSuccess = createAction(FETCH_STATION_ACCOUNT_DETAIL_SUCCESS)


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
        stationAccounts.push(StationAccount.fromApi(item))
        if(item.station){
          stationAction.saveStation({station: StationDetail.fromApi(item.station)})
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
        stationAccounts.push(StationAccount.fromApi(item))
        if(item.station){
          stationAction.saveStation({station: StationDetail.fromApi(item.station)})
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

export const accountSaga = [
  takeLatest(FETCH_STATION_ACCOUNT, fetchStationAccounts),
  takeLatest(FETCH_STATION_ACCOUNT_DETAIL, fetchStationAccountsDetail),

]

/**** Reducer ****/

const initialState = AccountRecord()

export function accountReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_STATION_ACCOUNT_SUCCESS:
      return handleSaveStationAccounts(state, action)
    case FETCH_STATION_ACCOUNT_DETAIL_SUCCESS:
      return handleSaveStationAccounts(state, action)
    default:
      return state
  }
}

function handleSetAllStationAccounts(state, stationAccounts) {
  stationAccounts.forEach((item)=> {
    state = state.setIn(['allStationAccounts', item.id], item)
  })
  return state
}

function handleSaveStationAccounts(state, action) {

  let stationAccounts = action.payload.stationAccounts
  let stationAccountList = action.payload.stationAccountList
  console.log('stationAccounts=========>', stationAccounts, stationAccountList)
  if (stationAccountList && stationAccountList.length > 0) {
    state = state.set('stationAccountList', new List(stationAccountList))
    state = handleSetAllStationAccounts(state, stationAccounts)
  } else {
    state = state.set('stationAccountList', new List())
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
      accountInfo?stationAccounts.push(accountInfo?accountInfo.toJS():undefined):null
    })
  }
  return stationAccounts
}


export const accountSelector = {
  selectStationAccounts,

}
