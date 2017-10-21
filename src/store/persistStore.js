/**
 * Created by yangyang on 2017/6/28.
 */
import {persistStore} from 'redux-persist'
import createFilter from 'redux-persist-transform-filter'
import immutableTransform from 'redux-persist-transform-immutable'
import createStore from './createStore'
import {appStateAction} from '../util/appstate'
import {selector as authSelector} from '../util/auth'
import {rehydrateDone} from '../util/rehydrateRedux'

const configFilter = createFilter('CONFIG', [])

export default function persist(store) {
  return persistStore(store, {
    whitelist: ['AUTH', 'CONFIG','STATION', 'DEVICE', 'ORDER', 'PROMOTION', 'PROFIT'],
    // transforms: [configFilter]
  }, () => {
    // TODO: add function after rehydration is finished
    let state = store.getState()
    let token = authSelector.selectToken(state)
    if (token) {
      store.dispatch(rehydrateDone({token, rehydrated: true}))
    } else {
      // 必须在这个方法的最后调用，确保其他必须在持久化恢复之后进行的动作获取到此状态
      store.dispatch(appStateAction.updateRehydrate({rehydrated: true}))
    }
  })
}

export const store = createStore(window.__INITIAL_STATE__)
export const persistor = persist(store)
