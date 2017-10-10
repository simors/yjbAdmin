import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'
import {reducer as authReducer} from '../util/auth/'
import {reducer as backendUserReducer} from '../route/backenduser/'
import {stationReducer} from '../route/station/redux'
import {configReducer} from '../util/config'
import {deviceReducer} from '../route/device'
import {orderReducer} from '../route/order'
import {promotionReducer} from '../route/promotion'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    CONFIG: configReducer,
    router: routerReducer,
    AUTH: authReducer,
    BACKENDUSER: backendUserReducer,
    STATION: stationReducer,
    ORDER: orderReducer,
    DEVICE: deviceReducer,
    PROMOTION: promotionReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
