import React from 'react'
import ReactDOM from 'react-dom'
import {store} from './store/persistStore'
import {history} from './store/createStore'
import './logger-init'
import App from './App'
import './main.scss'
import AV from 'leancloud-storage'
import appConfig from './util/appConfig'
// Render Setup
// ------------------------------------
const MOUNT_NODE = document.getElementById('root')

AV.init({
  appId: appConfig.LC_APP_ID,
  appKey: appConfig.LC_APP_KEY
});

let render = () => {
  ReactDOM.render(
    <App store={store} history={history}/>,
    MOUNT_NODE
  )
}

// Development Tools
// ------------------------------------
if (__DEV__ || __STAGE__) {

  if (module.hot) {
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    render = () => {
      try {
        renderApp()
      } catch (e) {
        console.error(e)
        renderError(e)
      }
    }

    // Setup hot module replacement
    module.hot.accept([
      './App',
      './route/index',
      './store/saga',
      './store/reducer',
    ], () =>
      setImmediate(() => {

        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// Let's Go!
// ------------------------------------
if (!__TEST__) render()
