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
        <Menu.SubMenu key="/device" title={<span><Icon type="laptop" />干衣柜综合管理</span>}>
          <Menu.Item key="/device_list"><Link to="/device_list">干衣柜信息管理</Link></Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="/site" title={<span><Icon type="laptop" />服务点综合管理</span>}>
          <Menu.Item key="/site_list"><Link to="/site_list">服务点信息管理</Link></Menu.Item>
          <Menu.Item key="/site_investor"><Link to="/site_investor">投资人信息管理</Link></Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="/order" title={<span><Icon type="notification" />充值与订单管理</span>}>
          <Menu.Item key="/order_list"><Link to="/order_list">订单信息管理</Link></Menu.Item>
          <Menu.Item key="/order_recharge"><Link to="/order_recharge">用户充值管理</Link></Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="/settlement" title={<span><Icon type="notification" />结算报表</span>}>
          <Menu.Item key="/settlement_list"><Link to="/settlement_list">服务点分成统计</Link></Menu.Item>
          <Menu.Item key="/settlement_site"><Link to="/settlement_site">服务单位分成结算</Link></Menu.Item>
          <Menu.Item key="/settlement_investor"><Link to="/settlement_investor">投资人分成结算</Link></Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="/promotion" title={<span><Icon type="notification" />营销活动</span>}>
          <Menu.Item key="/promotion_list"><Link to="/promotion_list">活动管理</Link></Menu.Item>
          <Menu.Item key="/promotion_recharge"><Link to="/promotion_recharge">发布充值活动</Link></Menu.Item>
          <Menu.Item key="/promotion_score"><Link to="/promotion_score">发布积分活动</Link></Menu.Item>
          <Menu.Item key="/promotion_redEnvelope"><Link to="/promotion_redEnvelope">发布红包活动</Link></Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="/user" title={<span><Icon type="notification" />用户管理</span>}>
          <Menu.Item key="/user_list"><Link to="/user_list">用户信息管理</Link></Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="/message" title={<span><Icon type="notification" />消息推送</span>}>
          <Menu.Item key="/message_system"><Link to="/message_system">系统消息</Link></Menu.Item>
          <Menu.Item key="/message_promotion"><Link to="/message_promotion">营销类消息</Link></Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="/system" title={<span><Icon type="notification" />系统管理</span>}>
          <Menu.Item key="/system_user"><Link to="/system_user">用户与角色管理</Link></Menu.Item>
          <Menu.Item key="/system_log"><Link to="/system_log">操作日志管理</Link></Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="/profit" title={<span><Icon type="notification" />投资收益</span>}>
          <Menu.Item key="/profit_list"><Link to="/profit_list">投资收益管理</Link></Menu.Item>
        </Menu.SubMenu>
      </Menu>
    )
  }
}

export default withRouter(connect()(SiderMenu))
