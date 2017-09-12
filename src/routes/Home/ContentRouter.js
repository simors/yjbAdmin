/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Dashboard from '../../components/Dashboard/Dashboard'

export const contentRouter = (
  <Switch>
    <Route path="/dashboard" component={Dashboard}/>
  </Switch>
)