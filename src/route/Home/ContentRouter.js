/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch} from 'react-router-dom'
import Dashboard from '../../component/Dashboard'
import {EndUser} from '../enduser/'
import {AdminUser} from '../adminuser/'
import StationManager from '../station/StationManage'
import Order, {Recharge} from '../order'
import Device from '../device'
import InvestorManager from '../station/InvestorManage'
import ShowStation from '../station/ShowStation'
import EditStation from '../station/EditStation'
import AddStation from '../station/AddStation'
import Promotion, {RechargePromotion, RechargePromotionStat, RedEnvelopePromotion, ScorePromotion,
  RedEnvelopePromotionStat, ScorePromotionStat, ScoreExchangePromotion, ScoreExchangePromStat} from '../promotion'
import StationAccountManager from '../account/StationAccountManager'
import StationAccountChartView from '../account/StationAccountChartView'
import PartnerAccountManager from '../account/PartnerAccountManager'
import PartnerAccountChartView from '../account/PartnerAccountChartView'
import InvestorAccountManager from '../account/InvestorAccountManager'
import InvestorAccountChartView from '../account/InvestorAccountChartView'
import Profit from '../profit'
import OperationLogManager from '../operationLog'
import {selector as authSelector} from '../../util/auth/'
import {PERMISSION_CODE} from '../../util/rolePermission/'

const ContentRouter = (props) => {
  const {match} = props;
  return (
    <Switch>
      <Route exact path={match.url} component={Dashboard}/>
      <Route exact path="/device_list" component={Device}/>
      <Route exact path="/user_list" component={EndUser}/>
      {(() => { // 系统管理
        const items = [];
        if (props.sysUserVisible) {
          items.push(<Route exact path="/system_user" key='/system_user' component={AdminUser}/>);
        }
        if (props.sysLogVisible) {
          items.push(<Route exact path="/system_log" key='system_log' component={OperationLogManager}/>);
        }
        return (
          items
        );
      })()}
      <Route exact path="/site_list" component={StationManager}/>
      <Route exact path="/site_list/showStation/:id" component={ShowStation}/>
      <Route exact path="/site_list/editStation/:id" component={EditStation}/>
      <Route exact path="/site_list/addStation" component={AddStation}/>
      <Route exact path="/site_investor" component={InvestorManager}/>
      <Route exact path="/order_list" component={Order}/>
      <Route exact path="/order_recharge" component={Recharge}/>
      <Route exact path="/promotion_list" component={Promotion}/>
      <Route exact path="/promotion_list/recharge_stat" component={RechargePromotionStat}/>
      <Route exact path="/promotion_list/score_stat" component={ScorePromotionStat}/>
      <Route exact path="/promotion_list/redEnvelope_stat" component={RedEnvelopePromotionStat}/>
      <Route exact path="/promotion_list/scoreExchange_stat" component={ScoreExchangePromStat}/>
      <Route exact path="/promotion_recharge" component={RechargePromotion}/>
      <Route exact path="/promotion_redEnvelope" component={RedEnvelopePromotion}/>
      <Route exact path="/promotion_score" component={ScorePromotion}/>
      <Route exact path="/promotion_scoreExchange" component={ScoreExchangePromotion}/>
      <Route exact path="/settlement_list" component={StationAccountManager}/>
      <Route exact path="/settlement_list/stationChart" component={StationAccountChartView}/>
      <Route exact path="/settlement_site" component={PartnerAccountManager}/>
      <Route exact path="/settlement_site/partnerChart" component={PartnerAccountChartView}/>
      <Route exact path="/settlement_investor" component={InvestorAccountManager}/>
      <Route exact path="/settlement_investor/investorChart" component={InvestorAccountChartView}/>
      <Route exact path="/profit_list" component={Profit}/>
    </Switch>
  )
}

export const breadcrumbNameMap = {
  '/device_list': '干衣柜信息管理',
  '/user_list': '用户信息管理',
  '/system_user': '用户与角色管理',
  '/system_log': '操作日志管理',
  '/site_list': '服务点信息管理',
  '/site_list/showStation': '查看服务点详情',
  '/site_list/editStation': '编辑服务点信息',
  '/site_list/addStation': '新增服务点',
  '/site_investor': '投资人信息管理',
  '/order_list': '订单信息管理',
  '/order_recharge': '用户充值管理',
  '/promotion_list': '活动管理',
  '/promotion_list/recharge_stat': '充值活动统计',
  '/promotion_list/score_stat': '积分倍率活动统计',
  '/promotion_list/scoreExchange_stat': '积分兑换活动统计',
  '/promotion_list/redEnvelope_stat': '红包活动统计',
  '/promotion_recharge': '发布充值活动',
  '/promotion_redEnvelope': '发布红包活动',
  '/promotion_score': '发布积分倍率活动',
  '/promotion_scoreExchange': '发布积分兑换活动',
  '/settlement_list': '服务点分成统计',
  '/settlement_list/stationChart': '服务点分成报表',
  '/settlement_site': '服务单位分成结算',
  '/settlement_site/partnerChart': '服务单位分成报表',
  '/settlement_investor': '投资人分成结算',
  '/settlement_investor/investorChart': '投资人分成报表',
  '/profit_list': '投资收益管理',
};

const mapStateToProps = (appState, ownProps) => {
  const sysUserVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.SYSMAN_MAN_USER_ROLE]);
  const sysLogVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.SYSMAN_MAN_OPER_LOG]);

  return {
    sysUserVisible,
    sysLogVisible,
  };
};

export default connect(mapStateToProps, null)(ContentRouter)
