/**
 * Created by yangyang on 2017/9/4.
 */
import React from 'react'
import {connect} from 'react-redux'
import {
  Menu,
  Icon,
  Button,
} from 'antd'
import {withRouter, Link} from 'react-router-dom'
import {selector as authSelector} from '../util/auth/'
import {PERMISSION_CODE} from '../util/rolePermission/'

const SubMenu = Menu.SubMenu

class SiderMenu extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    current: '1',
    openKeys: [],
  };

  handleClick = (e) => {
    console.log('Clicked: ', e);
    this.setState({ current: e.key });
  };

  onOpenChange = (openKeys) => {
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    this.setState({ openKeys: nextOpenKeys });
  };

  getAncestorKeys = (key) => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  };

  renderQueryDeviceMenu() {
    let {queryDeviceVisible} = this.props
    if (queryDeviceVisible) {
      return (
        <Menu.SubMenu key="/device" title={<span><Icon type="laptop" />干衣柜综合管理</span>}>
          <Menu.Item key="/device_list"><Link to="/device_list">干衣柜信息管理</Link></Menu.Item>
        </Menu.SubMenu>
      )
    }
    return null
  }

  renderStationMenu() {
    let {stationQueryVisible, stationInvestorVisible} = this.props
    if (stationQueryVisible || stationInvestorVisible) {
      let items = []
      if (stationQueryVisible) {
        items.push(<Menu.Item key="/site_list"><Link to="/site_list">服务点信息管理</Link></Menu.Item>)
      }
      if (stationInvestorVisible) {
        items.push(<Menu.Item key="/site_investor"><Link to="/site_investor">投资人信息管理</Link></Menu.Item>)
      }
      return (
        <Menu.SubMenu key="/site" title={<span><Icon type="shop" />服务点综合管理</span>}>
          {items}
        </Menu.SubMenu>
      )
    }
    return null
  }

  renderRechargeOrderMenu() {
    let {orderVisible, rechargeVisible} = this.props
    if (orderVisible || rechargeVisible) {
      let items = []
      if (orderVisible) {
        items.push(<Menu.Item key="/order_list"><Link to="/order_list">订单信息管理</Link></Menu.Item>)
      }
      if (rechargeVisible) {
        items.push(<Menu.Item key="/order_recharge"><Link to="/order_recharge">用户充值管理</Link></Menu.Item>)
      }
      return (
        <Menu.SubMenu key="/order" title={<span><Icon type="solution" />充值与订单管理</span>}>
          {items}
        </Menu.SubMenu>
      )
    }
    return null
  }

  renderAccountMenu() {
    let {accountStationVisible, accountDepartmentVisible, accountInvestorVisible} = this.props
    if (accountStationVisible || accountDepartmentVisible || accountInvestorVisible) {
      let items = []
      if (accountStationVisible) {
        items.push(<Menu.Item key="/settlement_list"><Link to="/settlement_list">服务点分成统计</Link></Menu.Item>)
      }
      if (accountDepartmentVisible) {
        items.push(<Menu.Item key="/settlement_site"><Link to="/settlement_site">服务单位分成结算</Link></Menu.Item>)
      }
      if (accountInvestorVisible) {
        items.push(<Menu.Item key="/settlement_investor"><Link to="/settlement_investor">投资人分成结算</Link></Menu.Item>)
      }
      return (
        <Menu.SubMenu key="/settlement" title={<span><Icon type="pie-chart" />结算报表</span>}>
          {items}
        </Menu.SubMenu>
      )
    }
    return null
  }

  renderMarkingMenu() {
    let {marketManVisible, marketRechargeVisible, marketCreditVisible, marketRedPacketsVisible, marketCreditExchangeVisible} = this.props
    if (marketManVisible || marketRechargeVisible || marketCreditVisible || marketRedPacketsVisible || marketCreditExchangeVisible) {
      let items = []
      if (marketManVisible) {
        items.push(<Menu.Item key="/promotion_list"><Link to="/promotion_list">活动管理</Link></Menu.Item>)
      }
      if (marketRechargeVisible) {
        items.push(<Menu.Item key="/promotion_recharge"><Link to="/promotion_recharge">发布充值活动</Link></Menu.Item>)
      }
      if (marketCreditVisible) {
        items.push(<Menu.Item key="/promotion_score"><Link to="/promotion_score">发布积分倍率活动</Link></Menu.Item>)
      }
      if (marketCreditExchangeVisible) {
        items.push(<Menu.Item key="/promotion_scoreExchange"><Link to="/promotion_scoreExchange">发布积分兑换活动</Link></Menu.Item>)
      }
      if (marketRedPacketsVisible) {
        items.push(<Menu.Item key="/promotion_redEnvelope"><Link to="/promotion_redEnvelope">发布红包活动</Link></Menu.Item>)
      }
      return (
        <Menu.SubMenu key="/promotion" title={<span><Icon type="gift" />营销活动</span>}>
          {items}
        </Menu.SubMenu>
      )
    }
    return null
  }

  renderManUserMenu() {
    let {manUserVisible} = this.props
    if (manUserVisible) {
      return (
        <Menu.SubMenu key="/user" title={<span><Icon type="team" />用户管理</span>}>
          <Menu.Item key="/user_list"><Link to="/user_list">用户信息管理</Link></Menu.Item>
        </Menu.SubMenu>
      )
    }
    return null
  }

  renderSysMessageMenu() {
    let {sendSysMsgVisible, sendMarketingMsgVisible} = this.props
    if (sendSysMsgVisible || sendMarketingMsgVisible) {
      let items = []
      if (sendSysMsgVisible) {
        items.push(<Menu.Item key="/message_system"><Link to="/message_system">系统消息</Link></Menu.Item>)
      }
      if (sendMarketingMsgVisible) {
        items.push(<Menu.Item key="/message_promotion"><Link to="/message_promotion">营销类消息</Link></Menu.Item>)
      }
      return (
        <Menu.SubMenu key="/message" title={<span><Icon type="notification" />消息推送</span>}>
          {items}
        </Menu.SubMenu>
      )
    }
    return null
  }

  renderSysManMenu() {
    if (this.props.sysUserVisible || this.props.sysLogVisible) {
      const items = [];
      if (this.props.sysUserVisible) {
        items.push(<Menu.Item key='/system_user'><Link to='/system_user'>用户与角色管理</Link></Menu.Item>);
      }
      if (this.props.sysLogVisible) {
        items.push(<Menu.Item key='/system_log'><Link to='/system_log'>操作日志管理</Link></Menu.Item>);
      }
      return (
        <Menu.SubMenu key="/system" title={<span><Icon type="setting"/>系统管理</span>}>
          {items}
        </Menu.SubMenu>
      );
    }
    return null
  }

  renderProfitMenu() {
    let {profitVisible} = this.props
    if (profitVisible) {
      return (
        <Menu.SubMenu key="/profit" title={<span><Icon type="bank" />投资收益</span>}>
          <Menu.Item key="/profit_list"><Link to="/profit_list">投资收益管理</Link></Menu.Item>
        </Menu.SubMenu>
      )
    }
    return null
  }

  render() {
    return (
      <Menu
        theme="dark"
        mode="inline"
        openKeys={this.state.openKeys}
        selectedKeys={[this.state.current]}
        onOpenChange={this.onOpenChange}
        onClick={this.handleClick}
        className="app-sider-menu"
      >
        {this.renderQueryDeviceMenu()}
        {this.renderStationMenu()}
        {this.renderRechargeOrderMenu()}
        {this.renderAccountMenu()}
        {this.renderMarkingMenu()}
        {this.renderManUserMenu()}
        {this.renderSysMessageMenu()}
        {this.renderSysManMenu()}
        {this.renderProfitMenu()}
      </Menu>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  const queryDeviceVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.DEVICE_QUERY_INFO])

  const stationQueryVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.STATION_BASE_QUERY, PERMISSION_CODE.STATION_QUERY_PARTNER])
  const stationInvestorVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.STATION_INVESTOR_BASE_QUERY])

  const orderVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.RECHARGE_ORDER_QUERY])
  const rechargeVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.RECHARGE_MAN_USER_PAID])

  const accountStationVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.ACCOUNT_STAT_STATION_DIVIDEND])
  const accountDepartmentVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.ACCOUNT_STATION_DEPARTMENT_DIVIDEND])
  const accountInvestorVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.ACCOUNT_INVESTOR_DIVIDEND])

  const marketManVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.MARKETING_MAN_ACTIVITY])
  const marketRechargeVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.MARKETING_PUBLISH_RECHARGE])
  const marketCreditVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.MARKETING_PUBLISH_CREDIT])
  const marketRedPacketsVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.MARKETING_PUBLISH_RED_PACKETS])
  const marketCreditExchangeVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.MARKETING_PUBLISH_CREDIT_EXCHANGE])

  const manUserVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.USER_MAN_USER_PROFILE])

  const sendSysMsgVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.PUSH_SYSTEM_MSG])
  const sendMarketingMsgVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.PUSH_MARKETING_MSG])

  const sysUserVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.SYSMAN_MAN_USER_ROLE]);
  const sysLogVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.SYSMAN_MAN_OPER_LOG]);

  const profitVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.INVEST_PROFIT_MANAGER])

  return {
    queryDeviceVisible,
    stationQueryVisible,
    stationInvestorVisible,
    orderVisible,
    rechargeVisible,
    accountStationVisible,
    accountDepartmentVisible,
    accountInvestorVisible,
    marketManVisible,
    marketRechargeVisible,
    marketCreditVisible,
    marketRedPacketsVisible,
    marketCreditExchangeVisible,
    manUserVisible,
    sendSysMsgVisible,
    sendMarketingMsgVisible,
    sysUserVisible,
    sysLogVisible,
    profitVisible,
  };
};

export default withRouter(connect(mapStateToProps, null)(SiderMenu))
