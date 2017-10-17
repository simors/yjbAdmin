/**
 * Created by yangyang on 2017/6/28.
 */
import { all } from 'redux-saga/effects'
import {appStateSaga} from '../util/appstate'
import {rehydrateSaga} from '../util/rehydrateRedux'
import {saga as authSaga} from '../util/auth/'
import {stationSaga} from '../route/station/redux'
import {configSaga} from '../util/config'
import {orderSaga} from '../route/order'
import {deviceSaga} from '../route/device'
import {promotionSaga} from '../route/promotion'
import {accountSaga} from '../route/account/redux'

export default function* rootSaga() {
  yield all([
    ...rehydrateSaga,
    ...appStateSaga,
    ...authSaga,
    ...configSaga,
    ...stationSaga,
    ...orderSaga,
    ...deviceSaga,
    ...promotionSaga,
    ...accountSaga
  ])
}
