// We only need to import the modules necessary for initial render
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import AppIndex from '../components/AppIndex'
import Home from '../components/Home'
import About from '../components/About'

const routes = (
  <Route path="/" component={AppIndex}>
    <IndexRoute component={Home}/>
    <Route path="about" component={About}/>
  </Route>
)

export default routes