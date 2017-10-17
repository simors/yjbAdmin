/**
 * Created by yangyang on 2017/9/21.
 */
import { put, call, takeLatest } from 'redux-saga/effects'
import {createAction} from 'redux-actions'
import {action as authAction} from './auth'
import {appStateAction} from './appstate'

/**** Constant ****/

const REHYDRATE_DONE = 'REHYDRATE_DONE'

/**** Action ****/

export const rehydrateDone = createAction(REHYDRATE_DONE)

/**** Saga ****/

function* doneRehydrate(action) {
  let payload = action.payload
  yield put(authAction.loginWithToken({token: payload.token}))
  yield put(appStateAction.updateRehydrate({rehydrated: payload.rehydrated}))
}

export const rehydrateSaga = [
  takeLatest(REHYDRATE_DONE, doneRehydrate)
]