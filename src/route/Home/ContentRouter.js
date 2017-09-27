/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Dashboard from '../../component/Dashboard'
import SysConfig from '../../component/SysConfig'
import {SysUser} from '../sysuser/'
import StationManager from '../station/StationManage'
import Cabinet from '../Cabinet'
import Order from '../Order'
import InvestorManager from '../station/InvestorManage'
import ShowStation from '../station/ShowStation'
import EditStation from '../station/EditStation'
import AddStation from '../station/AddStation'

const ContentRouter = ({match}) => {
  return (
    <Switch>
      <Route exact path={match.url} component={Dashboard}/>
      <Route exact path="/cabinet/list" component={Cabinet} />
      <Route exact path="/system/user" component={SysUser} />
      <Route exact path="/site/list" component={StationManager} />
      <Route exact path="/order/list" component={Order} />
      <Route exact path="/order/deposit" component={SysConfig} />
      <Route exact path="/site/showStation/:id" component={ShowStation} />
      <Route exact path="/site/editStation/:id" component={EditStation} />
      <Route exact path="/site/addStation" component={AddStation} />
      <Route exact path="/site/investor" component={InvestorManager} />
    </Switch>
  )
}

export default ContentRouter
