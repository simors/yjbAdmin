import { applyMiddleware, compose, createStore as createReduxStore } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import {createLogger} from 'redux-logger'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import makeRootReducer from './reducer'
import rootSaga from './saga'

export const history = createHistory()

const createStore = (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const logger = createLogger({predicate: (getState, action) => __DEV__})
  const routeMiddleware = routerMiddleware(history)
  const sagaMiddleware = createSagaMiddleware()
  const middleware = [routeMiddleware, sagaMiddleware, logger]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  let composeEnhancers = compose

  if (__DEV__) {
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createReduxStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  // 执行saga
  sagaMiddleware.run(rootSaga)
  store.close = () => store.dispatch(END)

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const reducers = require('./reducer').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}

export default createStore
