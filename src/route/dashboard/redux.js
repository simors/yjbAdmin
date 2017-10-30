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

class Dashboard extends Record({
  mpUserStat: undefined,

}, 'Dashboard') {}

/******* Constants *******/

const REQUEST_MP_USER_STAT = 'REQUEST_MP_USER_STAT'
const SAVE_MP_USER_STAT = 'SAVE_MP_USER_STAT'

/******* Action *******/

export const dashboardAction = {
  requestMpUserStat: createAction(REQUEST_MP_USER_STAT),
}

const saveMpUserStat = createAction(SAVE_MP_USER_STAT)

/******* Saga *******/

export const dashboardSaga = [
  takeLatest(REQUEST_MP_USER_STAT, sagaFetchMpUserStat),
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

/******* Reducer *******/

const initialState = new Dashboard();

export function dashboardReducer(state=initialState, action) {
  switch(action.type) {
    case SAVE_MP_USER_STAT:
      return reduceSaveMpUserStat(state, action)
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

function onRehydrate(state, action) {
  const incoming = action.payload.DASHBOARD;
  if (!incoming) {
    return state
  }
  let mpUserStat = incoming.mpUserStat
  if (mpUserStat) {
    state = state.set('mpUserStat', MpUserStat.fromJson(mpUserStat))
  }
  return state
}

/******* Selector *******/

export const dashboardSelector = {
  selectMpUserStat,
}

function selectMpUserStat(state) {
  let mpUserStat = state.DASHBOARD.mpUserStat
  if (!mpUserStat) {
    return undefined
  }
  return mpUserStat.toJS()
}