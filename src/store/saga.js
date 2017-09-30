/**
 * Created by yangyang on 2017/6/28.
 */
import { all } from 'redux-saga/effects'
import {authSaga} from '../util/auth/'
import {stationSaga} from '../route/station/redux'
import {saga as sysUserSaga} from '../route/sysuser/'
import {configSaga} from '../util/config'
import {orderSaga} from '../route/Order'
import {deviceSaga} from '../route/device'

export default function* rootSaga() {
  yield all([
    ...authSaga,
    ...sysUserSaga,
    ...configSaga,
    ...stationSaga,
    ...orderSaga,
    ...deviceSaga,
  ])
}
