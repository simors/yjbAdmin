/**
 * Created by yangyang on 2017/10/21.
 */
import {call, put, select, takeLatest} from 'redux-saga/effects'
import {createAction} from 'redux-actions'
import {Record, Map, Set, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as profitCloud from './cloud'
import {stationAction} from '../station'
import {accountAction, ACCOUNT_TYPE} from '../account'
import {WITHDRAW_APPLY_TYPE, orderActions} from '../order'

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
  profitShare: Map(),             // Map(<profitShareType, List()>)
  withdrawLog: List(),            // 收益取现记录
}, 'Profit') {}

// --- constant

const GET_CURRENT_ADMIN_PROFIT = 'GET_CURRENT_ADMIN_PROFIT'
const SAVE_ADMIN_PROFIT = 'SAVE_ADMIN_PROFIT'
const GET_30_DAYS_ACCOUNT_PROFIT = 'GET_30_DAYS_ACCOUNT_PROFIT'
const GET_3_MONTHS_ACCOUNT_PROFIT = 'GET_3_MONTHS_ACCOUNT_PROFIT'
const GET_HALF_YEAR_ACCOUNT_PROFIT = 'GET_HALF_YEAR_ACCOUNT_PROFIT'
const GET_1_YEAR_ACCOUNT_PROFIT = 'GET_1_YEAR_ACCOUNT_PROFIT'
const SAVE_INVEST_PROFIT_STAT = 'SAVE_INVEST_PROFIT_STAT'
const SAVE_PARTNER_PROFIT_STAT = 'SAVE_PARTNER_PROFIT_STAT'
const REQUEST_PROFIT_WITHDRAW = 'REQUEST_PROFIT_WITHDRAW'
const GET_PROFIT_SHARING = 'GET_PROFIT_SHARING'
const SAVE_PROFIT_SHARING = 'SAVE_PROFIT_SHARING'
const FETCH_MINE_WITHDRAW_LOG = 'FETCH_MINE_WITHDRAW_LOG'
const SAVE_WITHDRAW_LOG = 'SAVE_WITHDRAW_LOG'

// --- action

export const profitAction = {
  getCurrentAdminProfit: createAction(GET_CURRENT_ADMIN_PROFIT),
  stat30DaysAccountProfit: createAction(GET_30_DAYS_ACCOUNT_PROFIT),
  stat3MonthsAccountProfit: createAction(GET_3_MONTHS_ACCOUNT_PROFIT),
  statHalfYearAccountProfit: createAction(GET_HALF_YEAR_ACCOUNT_PROFIT),
  stat1YearAccountProfit: createAction(GET_1_YEAR_ACCOUNT_PROFIT),
  requestProfitWithdraw: createAction(REQUEST_PROFIT_WITHDRAW),
  getProfitSharing: createAction(GET_PROFIT_SHARING),
  fetchMineWithdrawLog: createAction(FETCH_MINE_WITHDRAW_LOG),
}

const saveAdminProfit = createAction(SAVE_ADMIN_PROFIT)
const saveInvestProfitStat = createAction(SAVE_INVEST_PROFIT_STAT)
const savePartnerProfitStat = createAction(SAVE_PARTNER_PROFIT_STAT)
const saveProfitSharing = createAction(SAVE_PROFIT_SHARING)
const saveWithdrawLog = createAction(SAVE_WITHDRAW_LOG)

// --- saga

export const profitSaga = [
  takeLatest(GET_CURRENT_ADMIN_PROFIT, sagaGetAdminProfit),
  takeLatest(GET_30_DAYS_ACCOUNT_PROFIT, sagaStat30DaysAccountProfit),
  takeLatest(GET_3_MONTHS_ACCOUNT_PROFIT, sagaStat3MonthsAccountProfit),
  takeLatest(GET_HALF_YEAR_ACCOUNT_PROFIT, sagaStatHalfYearAccountProfit),
  takeLatest(GET_1_YEAR_ACCOUNT_PROFIT, sagaStat1YearAccountProfit),
  takeLatest(REQUEST_PROFIT_WITHDRAW, sagaRequestProfitWithdraw),
  takeLatest(GET_PROFIT_SHARING, sagaGetProfitSharing),
  takeLatest(FETCH_MINE_WITHDRAW_LOG, sagaGetWithdrawLog),
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
    if (ACCOUNT_TYPE.INVESTOR_ACCOUNT == payload.accountType) {
      yield put(saveInvestProfitStat({stat}))
    } else if (ACCOUNT_TYPE.PARTNER_ACCOUNT == payload.accountType) {
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

function* sagaStat3MonthsAccountProfit(action) {
  let payload = action.payload
  try {
    let stat = yield call(profitCloud.stat3MonthsAccountProfit, {accountType: payload.accountType})
    let stations = []
    stat.forEach((statData) => {
      stations.push(statData.station)
    })
    yield put(stationAction.saveStations({stations}))
    yield put(accountAction.saveBatchAccountProfit({accoutProfits: stat}))
    if (ACCOUNT_TYPE.INVESTOR_ACCOUNT == payload.accountType) {
      yield put(saveInvestProfitStat({stat}))
    } else if (ACCOUNT_TYPE.PARTNER_ACCOUNT == payload.accountType) {
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

function* sagaStatHalfYearAccountProfit(action) {
  let payload = action.payload
  try {
    let stat = yield call(profitCloud.statHalfYearAccountProfit, {accountType: payload.accountType})
    let stations = []
    stat.forEach((statData) => {
      stations.push(statData.station)
    })
    yield put(stationAction.saveStations({stations}))
    yield put(accountAction.saveBatchAccountProfit({accoutProfits: stat}))
    if (ACCOUNT_TYPE.INVESTOR_ACCOUNT == payload.accountType) {
      yield put(saveInvestProfitStat({stat}))
    } else if (ACCOUNT_TYPE.PARTNER_ACCOUNT == payload.accountType) {
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

function* sagaStat1YearAccountProfit(action) {
  let payload = action.payload
  try {
    let stat = yield call(profitCloud.stat1YearAccountProfit, {accountType: payload.accountType})
    let stations = []
    stat.forEach((statData) => {
      stations.push(statData.station)
    })
    yield put(stationAction.saveStations({stations}))
    yield put(accountAction.saveBatchAccountProfit({accoutProfits: stat}))
    if (ACCOUNT_TYPE.INVESTOR_ACCOUNT == payload.accountType) {
      yield put(saveInvestProfitStat({stat}))
    } else if (ACCOUNT_TYPE.PARTNER_ACCOUNT == payload.accountType) {
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

function* sagaRequestProfitWithdraw(action) {
  let payload = action.payload

  let transferPayload = {
    amount: payload.amount,
    applyType: WITHDRAW_APPLY_TYPE.PROFIT,
  }

  try {
    let result = yield call(profitCloud.createWithdrawApply, transferPayload)
    if(payload.success) {
      payload.success(result)
    }

  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

function* sagaGetProfitSharing(action) {
  let payload = action.payload
  try {
    let profits = yield call(profitCloud.getProfitSharing, payload)
    yield put(stationAction.saveBatchProfitShare({type: payload.type, profitShares: profits}))
    yield put(saveProfitSharing({type: payload.type, profitShares: profits}))
  } catch (e) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

function* sagaGetWithdrawLog(action) {
  let payload = action.payload
  try {
    let params = {
      start: payload.start,
      end: payload.end,
      applyType: WITHDRAW_APPLY_TYPE.PROFIT,
    }
    let withdraw = yield call(profitCloud.fetchWithdrawLog, params)
    yield put(orderActions.saveBatchWithdrawApply({applys: withdraw}))
    yield put(saveWithdrawLog({withdrawLog: withdraw}))
    if(payload.success) {
      payload.success()
    }
  } catch (e) {
    if(payload.error) {
      payload.error(error)
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
    case SAVE_PROFIT_SHARING:
      return reduceSaveProfitSharing(state, action)
    case SAVE_WITHDRAW_LOG:
      return reduceSaveWithdrawLog(state, action)
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

function reduceSaveProfitSharing(state, action) {
  let payload = action.payload
  let profitShares = payload.profitShares
  let type = payload.type
  let profitShareIds = []
  profitShares.forEach((profitShare) => {
    profitShareIds.push(profitShare.id)
  })
  state = state.setIn(['profitShare', type], new List(profitShareIds))
  return state
}

function reduceSaveWithdrawLog(state, action) {
  let payload = action.payload
  let withdrawLog = payload.withdrawLog
  let applyList = []
  withdrawLog.forEach((apply) => {
    applyList.push(apply.id)
  })
  state = state.set('withdrawLog', new List(applyList))
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
  selectInvestProfitList,
  selectPartnerProfitList,
  selectProfitShareIdList,
  selectWithdrawLog,
}

function selectAdminProfit(state) {
  let profit = state.PROFIT.adminProfit
  if (!profit) {
    return undefined
  }
  return profit.toJS()
}

function selectInvestProfitList(state) {
  let investProfits = state.PROFIT.statInvestorProfits
  if (!investProfits) {
    return []
  }
  return investProfits.toJS()
}

function selectPartnerProfitList(state) {
  let partnetProfits = state.PROFIT.statPartnerProfits
  if (!partnetProfits) {
    return []
  }
  return partnetProfits.toJS()
}

function selectProfitShareIdList(state, type) {
  let shareList = state.PROFIT.getIn(['profitShare', type])
  if (!shareList) {
    return []
  }
  return shareList.toJS()
}

function selectWithdrawLog(state) {
  let logs = state.PROFIT.get('withdrawLog')
  if (!logs) {
    return []
  }
  return logs.toJS()
}