import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'
import {appStateReducer} from '../util/appstate'
import {loadReducer} from '../component/loadActivity'
import {reducer as authReducer} from '../util/auth/'
import {reducer as endUserReducer} from '../route/enduser/'
import {reducer as backendUserReducer} from '../route/backenduser/'
import {stationReducer} from '../route/station/redux'
import {configReducer} from '../util/config'
import {deviceReducer} from '../route/device'
import {orderReducer} from '../route/order'
import {promotionReducer} from '../route/promotion'
import {profitReducer} from '../route/profit'
import {accountReducer} from '../route/account'
import {operationLogReducer} from '../route/operationLog'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    LOADING: loadReducer,
    APPSTATE: appStateReducer,
    CONFIG: configReducer,
    router: routerReducer,
    AUTH: authReducer,
    ENDUSER: endUserReducer,
    BACKENDUSER: backendUserReducer,
    STATION: stationReducer,
    ORDER: orderReducer,
    DEVICE: deviceReducer,
    PROMOTION: promotionReducer,
    ACCOUNT: accountReducer,
    PROFIT: profitReducer,
    OPERATIONLOG: operationLogReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
