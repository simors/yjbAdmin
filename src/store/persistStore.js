/**
 * Created by yangyang on 2017/6/28.
 */
import {persistStore} from 'redux-persist'
import createFilter from 'redux-persist-transform-filter'
import immutableTransform from 'redux-persist-transform-immutable'
import createStore from './createStore'

const configFilter = createFilter('CONFIG', [])

export default function persist(store) {
  return persistStore(store, {
    whitelist: ['CONFIG'],
    // transforms: [configFilter]
  }, () => {
    // TODO: add function after rehydration is finished
  })
}

export const store = createStore(window.__INITIAL_STATE__)
export const persistor = persist(store)