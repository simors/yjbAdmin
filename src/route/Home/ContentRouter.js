/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Dashboard from '../../component/Dashboard'
import SysConfig from '../../component/SysConfig'
import {EndUser} from '../enduser/'
import {BackendUser} from '../backenduser/'
import StationManager from '../station/StationManage'
import Order, {Recharge} from '../order'
import Device from '../device'
import InvestorManager from '../station/InvestorManage'
import ShowStation from '../station/ShowStation'
import EditStation from '../station/EditStation'
import AddStation from '../station/AddStation'
import Promotion, {RechargePromotion} from '../promotion'
import StationAccountManager from '../account/StationAccountManager'
import StationAccountChartView from '../account/StationAccountChartView'
import PartnerAccountManager from '../account/PartnerAccountManager'
import PartnerAccountChartView from '../account/PartnerAccountChartView'
import InvestorAccountManager from '../account/InvestorAccountManager'
import InvestorAccountChartView from '../account/InvestorAccountChartView'
import Profit from '../profit'
import OperationLogManager from '../operationLog'

const ContentRouter = ({match}) => {
  return (
    <Switch>
      <Route exact path={match.url} component={Dashboard}/>
      <Route exact path="/device/list" component={Device}/>
      <Route exact path="/user/list" component={EndUser}/>
      <Route exact path="/system/user" component={BackendUser}/>
      <Route exact path="/system/log" component={OperationLogManager}/>
      <Route exact path="/site/list" component={StationManager}/>
      <Route exact path="/order/list" component={Order}/>
      <Route exact path="/order/recharge" component={Recharge}/>
      <Route exact path="/site/showStation/:id" component={ShowStation}/>
      <Route exact path="/site/editStation/:id" component={EditStation}/>
      <Route exact path="/site/addStation" component={AddStation}/>
      <Route exact path="/site/investor" component={InvestorManager}/>
      <Route exact path="/promotion/list" component={Promotion}/>
      <Route exact path="/promotion/recharge" component={RechargePromotion}/>
      <Route exact path="/settlement/list" component={StationAccountManager}/>
      <Route exact path="/settlement/stationChart" component={StationAccountChartView}/>
      <Route exact path="/settlement/site" component={PartnerAccountManager}/>
      <Route exact path="/settlement/partnerChart" component={PartnerAccountChartView}/>
      <Route exact path="/settlement/investor" component={InvestorAccountManager}/>
      <Route exact path="/settlement/investorChart" component={InvestorAccountChartView}/>
      <Route exact path="/profit/list" component={Profit}/>

    </Switch>
  )
}

export default ContentRouter
