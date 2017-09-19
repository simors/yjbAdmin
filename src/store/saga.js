/**
 * Created by yangyang on 2017/6/28.
 */
import { all } from 'redux-saga/effects'
// import {saga as sysUserSaga} from '../route/sysuser/redux'
import {stationSaga} from '../route/station/redux'
import {saga as sysUserSaga} from '../route/sysuser/'
import {configSaga} from '../util/config'


export default function* rootSaga() {
  yield all([
    ...sysUserSaga,
    ...configSaga,
    ...stationSaga
  ])
}
