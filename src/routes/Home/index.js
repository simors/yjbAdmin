/**
 * Created by yangyang on 2017/9/3.
 */
import React, {Component} from 'react'
import {
  Layout,
  Row,
  Col,
  Breadcrumb,
} from 'antd'
import {Link, Route} from 'react-router-dom'
import './home.scss'

const {Header, Footer, Sider, Content} = Layout

export default class Home extends Component {
  constructor(props) {
    super(props)
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
              <Row type="flex">
                <Col span={2}>
                  <div>logo</div>
                </Col>
                <Col span={8}>
                  <div>后台管理系统Demo</div>
                </Col>
                <Col span={6} offset={8}>
                  <div>您好！simors！</div>
                </Col>
              </Row>
            </Header>
            <Layout>
              <Content>
                <Breadcrumb className="bread">
                  <Breadcrumb.Item>User</Breadcrumb.Item>
                  <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{height: '1124px'}}></div>
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