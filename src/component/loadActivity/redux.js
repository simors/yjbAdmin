/**
 * Created by yangyang on 2017/10/17.
 */
import {call, put, takeLatest} from 'redux-saga/effects';
import {createAction} from 'redux-actions';
import {Record, Map, Set} from 'immutable';

//   Model

class LoadRecord extends Record({
  loading: undefined,
}, 'Load') {

}

// --- constant

const UPDATE_LOADING = 'UPDATE_LOADING'
const UPDATE_LOADING_SUCCESS = 'UPDATE_LOADING_SUCCESS'

// --- action

export const loadAction = {
  updateLoadingState: createAction(UPDATE_LOADING)
}

const updateLoadSuccess = createAction(UPDATE_LOADING_SUCCESS)

// --- saga

function* sagaUpdateLoad(action) {
  let isLoading = action.payload.isLoading
  yield put(updateLoadSuccess({isLoading}))
}

export const loadSaga = [
  takeLatest(UPDATE_LOADING, sagaUpdateLoad),
]

// --- reducer

const initialState = new LoadRecord()

export function loadReducer(state=initialState, action) {
  switch(action.type) {
    case UPDATE_LOADING_SUCCESS:
      return reduceUpdateLoadState(state, action)
    default:
      return state
  }
}

function reduceUpdateLoadState(state, action) {
  state = state.set('loading', action.payload.isLoading)
  return state
}

// --- selector

function selectLoadState(state) {
  return state.LOADING.loading
}

export const loadSelector = {
  selectLoadState,
}