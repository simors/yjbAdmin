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

class ComposeMenu extends React.Component {
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

  render() {
    let {match} = this.props
    return (
      <div style={{ flex: 1 }}>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          onClick={this.handleClick}
        >
          <Menu.Item key="1">
            <Icon type="pie-chart" />
            {/*<span><Link to={`${match.url}/dashboard`}>Dashboard</Link></span>*/}
            <span><Link to="/dashboard">Dashboard</Link></span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="desktop" />
            <span><Link to="/sysconfig">System Config</Link></span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="inbox" />
            <span>Option 3</span>
          </Menu.Item>
          <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
            <Menu.Item key="5"><Link to="/sysconfig">System Config</Link></Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </SubMenu>
        </Menu>
      </div>
    )
  }
}

export default withRouter(connect()(ComposeMenu))