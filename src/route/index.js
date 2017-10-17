// We only need to import the modules necessary for initial render
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import AuthRoute from './AuthRoute'
import Login from './Login'
import LoadingPage from './Loading'
import Home from './Home'
import NoMatch from './NoMatch'

const rootRoutes = (
  <Switch>
    <Route exact path="/login" component={Login}/>
    <Route exact path="/loading" component={LoadingPage}/>
    <AuthRoute path="/" component={Home}/>
    <Route component={NoMatch}/>
  </Switch>
)

export default rootRoutes
