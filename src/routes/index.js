// We only need to import the modules necessary for initial render
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import About from '../components/About'
import NoMatch from './NoMatch'

const rootRoutes = [
  <Switch>
    <Route key="home" exact path="/" component={Home}/>
    <Route key="login" path="/login" component={Login}/>
    <Route key="about" path="/about" component={About}/>
    <Route key="noMatch" component={NoMatch}/>
  </Switch>,
]

export default rootRoutes