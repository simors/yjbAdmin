/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Dashboard from '../../components/Dashboard'
import SysConfig from '../../components/SysConfig'
import SysUser from '../sysuser/SysUser'

const ContentRouter = ({match}) => {
  return (
    <Switch>
      <Route exact path={match.url} component={Dashboard}/>
      <Route exact path="/cabinet/list" component={SysConfig} />
      <Route exact path="/system/user" component={SysUser} />
    </Switch>
  )
}

export default ContentRouter
