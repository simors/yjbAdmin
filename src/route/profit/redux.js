/**
 * Created by yangyang on 2017/10/21.
 */
import {call, put, select, takeLatest} from 'redux-saga/effects'
import {createAction} from 'redux-actions'
import {Record, Map, Set, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as profitCloud from './cloud'
import {stationAction} from '../station/index'
import {accountAction} from '../account/index'

// --- model

class AdminProfit extends Record({
  userId: undefined,          // 当前记录对应的用户id
  balance: undefined,         // 收益余额
  investEarn: undefined,      // 历史所有投资收益总额
  providerEarn: undefined,    // 作为服务单位历史所有分红收益总额
}, 'Profit') {
  static fromJson(json) {
    if (!json) {
      return undefined
    }
    let profit = new AdminProfit()
    return profit.withMutations((record) => {
      record.set('userId', json.userId)
      record.set('balance', json.balance)
      record.set('investEarn', json.invest_earn)
      record.set('providerEarn', json.provider_earn)
    })
  }
}

class Profit extends Record({
  adminProfit: undefined,         // 记录收益，类型为AdminProfit
  statInvestorProfits: List(),
  statPartnerProfits: List(),
}, 'Profit') {}

// --- constant

const GET_CURRENT_ADMIN_PROFIT = 'GET_CURRENT_ADMIN_PROFIT'
const SAVE_ADMIN_PROFIT = 'SAVE_ADMIN_PROFIT'
const GET_30_DAYS_ACCOUNT_PROFIT = 'GET_30_DAYS_ACCOUNT_PROFIT'
const SAVE_INVEST_PROFIT_STAT = 'SAVE_INVEST_PROFIT_STAT'
const SAVE_PARTNER_PROFIT_STAT = 'SAVE_PARTNER_PROFIT_STAT'

// --- action

export const profitAction = {
  getCurrentAdminProfit: createAction(GET_CURRENT_ADMIN_PROFIT),
  stat30DaysAccountProfit: createAction(GET_30_DAYS_ACCOUNT_PROFIT),
}

const saveAdminProfit = createAction(SAVE_ADMIN_PROFIT)
const saveInvestProfitStat = createAction(SAVE_INVEST_PROFIT_STAT)
const savePartnerProfitStat = createAction(SAVE_PARTNER_PROFIT_STAT)

// --- saga

export const profitSaga = [
  takeLatest(GET_CURRENT_ADMIN_PROFIT, sagaGetAdminProfit),
  takeLatest(GET_30_DAYS_ACCOUNT_PROFIT, sagaStat30DaysAccountProfit),
]

function* sagaGetAdminProfit(action) {
  let payload = action.payload
  try {
    let profit = yield call(profitCloud.fetchAdminProfit)
    yield put(saveAdminProfit({profit}))
    if (payload.success) {
      payload.success()
    }
  } catch (e) {
    if (payload.error) {
      payload.error(e.message)
    }
  }
}

function* sagaStat30DaysAccountProfit(action) {
  let payload = action.payload
  try {
    let stat = yield call(profitCloud.stat30DaysAccountProfit, {accountType: payload.accountType})
    let stations = []
    stat.forEach((statData) => {
      stations.push(statData.station)
    })
    yield put(stationAction.saveStations({stations}))
    yield put(accountAction.saveBatchAccountProfit({accoutProfits: stat}))
    if (1 == payload.accountType) {
      yield put(saveInvestProfitStat({stat}))
    } else if (2 == payload.accountType) {
      yield put(savePartnerProfitStat({stat}))
    }
    if (payload.success) {
      payload.success()
    }
  } catch (e) {
    if (payload.error) {
      payload.error(e.message)
    }
  }
}

// --- reducer

const initialState = new Profit()

export function profitReducer(state=initialState, action) {
  switch(action.type) {
    case SAVE_ADMIN_PROFIT:
      return reduceSaveProfit(state, action)
    case SAVE_INVEST_PROFIT_STAT:
      return reduceSaveInvestProfitStat(state, action)
    case SAVE_PARTNER_PROFIT_STAT:
      return reduceSavePartnerProfitStat(state, action)
    case REHYDRATE:
      return onRehydrate(state, action);
    default:
      return state
  }
}

function reduceSaveProfit(state, action) {
  let payload = action.payload
  let profit = payload.profit
  state = state.set('adminProfit', AdminProfit.fromJson(profit))
  return state
}

function reduceSaveInvestProfitStat(state, action) {
  let payload = action.payload
  let stat = payload.stat
  let profitList = []
  stat.forEach((profit) => {
    profitList.push(profit.id)
  })
  state = state.set('statInvestorProfits', new List(profitList))
  return state
}

function reduceSavePartnerProfitStat(state, action) {
  let payload = action.payload
  let stat = payload.stat
  let profitList = []
  stat.forEach((profit) => {
    profitList.push(profit.id)
  })
  state = state.set('statPartnerProfits', new List(profitList))
  return state
}

function onRehydrate(state, action) {
  let incoming = action.payload.PROFIT
  if (!incoming) {
    return state
  }

  state = state.set('adminProfit', AdminProfit.fromJson(incoming.adminProfit))

  return state
}

// --- selector

export const profitSelector = {
  selectAdminProfit,
}

function selectAdminProfit(state) {
  let profit = state.PROFIT.adminProfit
  if (!profit) {
    return undefined
  }
  return profit.toJS()
}