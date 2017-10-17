/**
 * Created by yangyang on 2017/9/21.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import { call, put, takeLatest } from 'redux-saga/effects'

/****  Model  ****/

const AppState = Record({
  isRehydrated: undefined,     // 是否已完成持久化数据恢复
}, 'AppState')

/**** Constant ****/

const UPDATE_REHYDRATE = 'UPDATE_REHYDRATE'
const UPDATE_REHYDRATE_SUCCESS = 'UPDATE_REHYDRATE_SUCCESS'

/**** Action ****/

export const appStateAction = {
  updateRehydrate: createAction(UPDATE_REHYDRATE),
}

const updateRehydrateSuccess = createAction(UPDATE_REHYDRATE_SUCCESS)

/**** Saga ****/

function* updateAppRehydrate(action) {
  let payload = action.payload
  try {
    yield put(updateRehydrateSuccess(payload))
  } catch (error) {
    console.log('update App State error:', error)
  }
}

export const appStateSaga = [
  takeLatest(UPDATE_REHYDRATE, updateAppRehydrate),
]

/**** Reducer ****/

const initialState = AppState()

export function appStateReducer(state = initialState, action) {
  switch(action.type) {
    case UPDATE_REHYDRATE_SUCCESS:
      return handleUpdateAppRehydrate(state, action)
    default:
      return state
  }
}

function handleUpdateAppRehydrate(state, action) {
  state = state.set('isRehydrated', action.payload.rehydrated)
  return state
}

/**** Selector ****/

function selectAppState(state) {
  let appState = state.APPSTATE
  return appState.toJS()
}

export const appStateSelector = {
  selectAppState,
}