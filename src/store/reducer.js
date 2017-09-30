import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'
import {authReducer} from '../util/auth/'
import {stationReducer} from '../route/station/redux'
import {reducer as sysUserReducer} from '../route/sysuser/'
import {configReducer} from '../util/config'
import {deviceReducer} from '../route/device'
import {orderReducer} from '../route/Order'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    CONFIG: configReducer,
    router: routerReducer,
    AUTH: authReducer,
    SYSUSER: sysUserReducer,
    STATION: stationReducer,
    ORDER: orderReducer,
    DEVICE: deviceReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
