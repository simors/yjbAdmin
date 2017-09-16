import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'
import {reducer as sysUserReducer} from '../route/sysuser/redux'
import {configReducer} from '../util/config'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    CONFIG: configReducer,
    router: routerReducer,
    sysuser: sysUserReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
