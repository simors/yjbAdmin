import React from 'react'
import ReactDOM from 'react-dom'
import {store} from './store/persistStore'
import {history} from './store/createStore'
import App from './App'
import './main.scss'
import AV from 'leancloud-storage'
// Render Setup
// ------------------------------------
const MOUNT_NODE = document.getElementById('root')

var APP_ID = 'QApBtOkMNfNo0lGaHxKBSWXX-gzGzoHsz';
var APP_KEY = 'znR6wk5JzFU0XIkgKxrM3fnH';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

let render = () => {
  ReactDOM.render(
    <App store={store} history={history}/>,
    MOUNT_NODE
  )
}

// Development Tools
// ------------------------------------
if (__DEV__) {

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
