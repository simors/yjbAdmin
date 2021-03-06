/**
 * Created by yangyang on 2017/6/28.
 */
import { all } from 'redux-saga/effects'
import {loadSaga} from '../component/loadActivity'
import {appStateSaga} from '../util/appstate'
import {rehydrateSaga} from '../util/rehydrateRedux'
import {saga as authSaga} from '../util/auth/'
import {saga as notificationSaga} from '../route/notification/'
import {stationSaga} from '../route/station/redux'
import {orderSaga} from '../route/order'
import {deviceSaga} from '../route/device'
import {promotionSaga} from '../route/promotion'
import {profitSaga} from '../route/profit'
import {accountSaga} from '../route/account'
import {operationLogSaga} from '../route/operationLog'
import {smsSaga} from '../component/smsModal'
import {dashboardSaga} from '../route/dashboard'

export default function* rootSaga() {
  yield all([
    ...loadSaga,
    ...rehydrateSaga,
    ...appStateSaga,
    ...authSaga,
    ...notificationSaga,
    ...stationSaga,
    ...orderSaga,
    ...deviceSaga,
    ...promotionSaga,
    ...accountSaga,
    ...profitSaga,
    ...operationLogSaga,
    ...smsSaga,
    ...dashboardSaga,
  ])
}
