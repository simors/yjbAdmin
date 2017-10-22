/**
 * Created by yangyang on 2017/9/21.
 */
import { put, call, takeLatest } from 'redux-saga/effects'
import {createAction} from 'redux-actions'
import {action as authAction} from './auth'
import {appStateAction} from './appstate'
import {history} from '../store/createStore'
import {message} from 'antd'

/**** Constant ****/

const REHYDRATE_DONE = 'REHYDRATE_DONE'

/**** Action ****/

export const rehydrateDone = createAction(REHYDRATE_DONE)

/**** Saga ****/

function* doneRehydrate(action) {
  let payload = action.payload
  let loginParams = {
    token: payload.token,
    onFailure: (code) => {
      message.error(`自动登录失败, 错误：${code}`)
      history.push('/login')
    },
  }
  yield put(authAction.loginWithToken(loginParams))
  yield put(appStateAction.updateRehydrate({rehydrated: payload.rehydrated}))
}

export const rehydrateSaga = [
  takeLatest(REHYDRATE_DONE, doneRehydrate)
]