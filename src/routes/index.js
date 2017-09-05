// We only need to import the modules necessary for initial render
import React from 'react'
import {Route} from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import About from '../components/About'
import NoMatch from './NoMatch'

const rootRoutes = [
  <Route key="home" exact path="/" component={Home}/>,
  <Route key="login" exact path="/login" component={Login}/>,
  <Route key="about" exact path="/about" component={About}/>,
  // <Route key="noMatch" component={NoMatch}/>,
]

export default rootRoutes