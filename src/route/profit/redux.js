/**
 * Created by yangyang on 2017/10/21.
 */
import {call, put, select, takeLatest} from 'redux-saga/effects'
import {createAction} from 'redux-actions'
import {Record, Map, Set, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as profitCloud from './cloud'

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
      record.set('investEarn', json.investEarn)
      record.set('providerEarn', json.providerEarn)
    })
  }
}

class Profit extends Record({
  adminProfit: undefined,         // 记录收益，类型为AdminProfit
}, 'Profit') {}

// --- constant

const GET_CURRENT_ADMIN_PROFIT = 'GET_CURRENT_ADMIN_PROFIT'
const SAVE_ADMIN_PROFIT = 'SAVE_ADMIN_PROFIT'

// --- action

export const profitAction = {
  getCurrentAdminProfit: createAction(GET_CURRENT_ADMIN_PROFIT),
}

const saveAdminProfit = createAction(SAVE_ADMIN_PROFIT)

// --- saga

export const profitSaga = [
  takeLatest(GET_CURRENT_ADMIN_PROFIT, sagaGetAdminProfit),
]

function* sagaGetAdminProfit(action) {
  let payload = action.payload
  try {
    let profit = yield call(profitCloud.fetchAdminProfit)
    yield put(saveAdminProfit({profit}))
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