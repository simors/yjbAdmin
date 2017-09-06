/**
 * Created by yangyang on 2017/9/3.
 */
import React, {Component} from 'react'
import {
  Layout,
  Row,
  Col,
  Breadcrumb,
  Menu,
  Dropdown,
  Icon,
} from 'antd'
import {Link, Route, withRouter} from 'react-router-dom'
import {fakeAuth} from '../../utils/AuthTool'
import './home.scss'

const {Header, Footer, Sider, Content} = Layout

class Home extends Component {
  constructor(props) {
    super(props)
  }

  userMenuOnClick = ({key}) => {
    let history = this.props.history
    if (key == 'logout') {
      console.log('user logout')
      fakeAuth.signout(() => history.push('/login'))
    }
  }

  renderUserLoginMenu() {
    return (
      <Menu onClick={this.userMenuOnClick}>
        <Menu.Item key="profile">
          个人信息
        </Menu.Item>
        <Menu.Item key="logout">
          注销
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    return (
      <div>
        <div className="layout">
          <aside className="menuLayout">
            <div>
              <div className="logo">
                <img src={require('../../asset/image/logo.jpg')} />
                <span>绿蚁网络</span>
              </div>
            </div>
          </aside>
          <div className="contentLayout">
            <Header style={{backgroundColor: '#FFF'}}>
              <div className="header">
                <div>后台管理系统Demo</div>
                <div>
                  <Dropdown overlay={this.renderUserLoginMenu()}>
                    <a className="ant-dropdown-link" href="#">
                      <Icon type="user" /> simors <Icon type="caret-down" />
                    </a>
                  </Dropdown>
                </div>
              </div>
            </Header>
            <Layout>
              <Content>
                <Breadcrumb className="bread">
                  <Breadcrumb.Item>User</Breadcrumb.Item>
                  <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content"></div>
              </Content>
              <Footer className="footer">
                <div>版权所有 © 长沙绿蚁网络科技有限公司 2017</div>
              </Footer>
            </Layout>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Home)