// We only need to import the modules necessary for initial render
import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import {fakeAuth} from '../utils/AuthTool'
import Login from './Login'
import Home from './Home'
import NoMatch from './NoMatch'

export const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    fakeAuth.isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

const rootRoutes = [
  <Switch key="rootSwitch">
    <AuthRoute key="home" exact path="/" component={Home}/>
    <Route key="login" path="/login" component={Login}/>
    <Route key="noMatch" component={NoMatch}/>
  </Switch>,
]

export default rootRoutes