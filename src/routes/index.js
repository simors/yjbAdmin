// We only need to import the modules necessary for initial render
import React from 'react'
import {Route} from 'react-router-dom'
import AppIndex from '../components/AppIndex'
import Home from '../components/Home'
import About from '../components/About'

const rootRoutes = [
  <Route key="home" path="/home" component={Home}/>,
  <Route key="about" path="/about" component={About}/>
]

export default rootRoutes