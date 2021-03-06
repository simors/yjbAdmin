/**
 * Created by yangyang on 2017/9/3.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  Layout,
  Breadcrumb,
  Menu,
  Dropdown,
  Icon,
} from 'antd'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import ContentRouter, {breadcrumbNameMap} from './ContentRouter'
import SiderMenu from '../../component/SiderMenu'
import style from './style.module.scss'
import {action as authAction, selector as authSelector} from '../../util/auth/'
import LoadActivity from '../../component/loadActivity'
import {Menu as ProfileMenu} from '../../component/Profile/'
import SmsModal from '../../component/smsModal'
import {Password} from '../../component/Profile/'

const {Header, Footer, Sider, Content} = Layout

class Home extends Component {
  constructor(props) {
    super(props)
  }

  renderUserLoginMenu = () =>  {
    return (
      <ProfileMenu />
    )
  };

  render() {
    let {match, activeUser, location} = this.props
    const pathSnippets = location.pathname.split('/').filter(i => JSON.stringify(breadcrumbNameMap).indexOf(i) > 0);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      let realUrl = url
      if (index == pathSnippets.length - 1) {
        realUrl = location.pathname
      }
      return (
        <Breadcrumb.Item key={url}>
          <Link to={realUrl}>
            {breadcrumbNameMap[url]}
          </Link>
        </Breadcrumb.Item>
      );
    });
    const breadcrumbItems = [(
      <Breadcrumb.Item key="home">
        <Link to="/">
          <Icon type="home" />
          <span style={{marginLeft: 5}}>主页</span>
        </Link>
      </Breadcrumb.Item>
    )].concat(extraBreadcrumbItems);

    if (!activeUser) {
      return <LoadActivity force={true}/>
    }
    return (
      <Layout style={{height: "100%"}}>
        <Sider width={180} className={style.siderMenu}>
          <Link to="/">
            <div className={style.logo}>
              <img src={require('../../asset/image/logo.png')} />
            </div>
          </Link>
          <SiderMenu />
        </Sider>
        <Layout className={style.main}>
          <Header className={style.header}>
            <div className={style.headerTitle}>
              <img src={require('../../asset/image/yijiabao.png')} width={350}/>
            </div>
            <div>
              <Dropdown trigger={['click']} overlay={this.renderUserLoginMenu()}>
                <a className="ant-dropdown-link" href="#" style={{color: '#fff'}}>
                  <Icon type="user" style={{color: '#fff', marginRight: 5}} />{activeUser.nickname}<Icon type="caret-down" style={{color: '#fff', marginLeft: 5}} />
                </a>
              </Dropdown>
            </div>
          </Header>
          <Content>
            <Breadcrumb className={style.bread}>
              {breadcrumbItems}
            </Breadcrumb>
            <LoadActivity/>
            <SmsModal/>
            <div className={style.container}>
              <div className={style.content}>
                <ContentRouter match={match}/>
              </div>
            </div>
          </Content>
          <Footer className={style.footer}>版权所有 © 长沙欧力电器有限公司 2017    由长沙绿蚁网络科技有限公司提供技术支持</Footer>
        </Layout>
        <Password />
      </Layout>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let activeUser = authSelector.selectCurUser(state)
  console.log('user', activeUser)
  return {
    activeUser,
  }
}

const mapDispatchToProps = {
  ...authAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))
