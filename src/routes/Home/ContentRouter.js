/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import AuthRoute from '../../routes/AuthRoute'
import Dashboard from '../../components/Dashboard/Dashboard'
import SysConfig from '../../components/System/SysConfig'

const ContentRouter = ({match}) => (
  <Switch>
    <AuthRoute exact path="/sysconfig" component={SysConfig}/>
    <AuthRoute path={match.url} component={Dashboard}/>
  </Switch>
)

export default ContentRouter