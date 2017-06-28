/**
 * Created by yangyang on 2017/6/28.
 */
import React, {Component} from 'react'
import {
  Layout,
  Row,
  Col,
} from 'antd'
import {Link, IndexLink} from 'react-router'

const { Header, Footer, Sider, Content } = Layout

export default class AppIndex extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Layout style={{height: '100%'}}>
        <Header>
          <Row>
            <Col span={2}>
              <IndexLink to="/">主页</IndexLink>
            </Col>
            <Col span={22}>
              <Link to="/about">关于我们</Link>
            </Col>
          </Row>
        </Header>
        <Layout>
          <Sider>Sider</Sider>
          <Content>
            {this.props.children}
          </Content>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    )
  }
}