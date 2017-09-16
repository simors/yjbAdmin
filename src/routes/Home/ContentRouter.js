/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Dashboard from '../../components/Dashboard'
import SysConfig from '../../components/SysConfig'

const ContentRouter = ({match}) => {
  return (
    <Switch>
      <Route exact path={match.url} component={Dashboard}/>
      <Route exact path="/cabinet/list" component={SysConfig} />
    </Switch>
  )
}

export default ContentRouter
