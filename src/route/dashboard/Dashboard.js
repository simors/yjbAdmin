/**
 * Created by yangyang on 2017/10/30.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Row, Col, Card} from 'antd';
import {selector as authSelector} from '../../util/auth'
import MpUserStat from './MpUserStat'
import DeviceStat from './DeviceStat'
import {dashboardSelector} from './redux'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  renderHeader() {
    let {currentAdminUser, roleNames, mpUserStat, deviceStat} = this.props
    if (!currentAdminUser || !roleNames || !mpUserStat || !deviceStat) {
      return null
    }
    return (
      <div>
        <Row>
          <Col span={12}>
            <div style={{fontSize: 24}}>
              {currentAdminUser.nickname}
            </div>
            <div style={{fontSize: 12}}>
              {
                roleNames.map((role, key) => {
                  return (
                    <span key={key} style={{marginRight: 8}}>
                      {role}
                    </span>
                  )
                })
              }
            </div>
          </Col>
          <Col span={4}>
            <div style={{fontSize: 20, textAlign: 'right'}}>用户数</div>
            <div style={{textAlign: 'right'}}>
              <span style={{fontSize: 22}}>{Number(mpUserStat.mpUserCount).toLocaleString()}</span>
              <span style={{fontSize: 12, marginLeft: 5}}>人</span>
            </div>
          </Col>
          <Col span={4}>
            <div style={{fontSize: 20, textAlign: 'right'}}>干衣柜</div>
            <div style={{textAlign: 'right'}}>
              <span style={{fontSize: 22}}>{Number(deviceStat.deviceCount).toLocaleString()}</span>
              <span style={{fontSize: 12, marginLeft: 5}}>台</span>
            </div>
          </Col>
          <Col span={4}>
            <div style={{fontSize: 20, textAlign: 'right'}}>服务点</div>
            <div style={{textAlign: 'right'}}>
              <span style={{fontSize: 22}}>{Number('215').toLocaleString()}</span>
              <span style={{fontSize: 12, marginLeft: 5}}>个</span>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderHeader()}
        <hr/>
        <div>
          <Row gutter={16}>
            <Col span={8}>
              <MpUserStat/>
            </Col>
            <Col span={8}>
              <DeviceStat/>
            </Col>
            <Col span={8}>
              <Card title="服务点" style={{ width: '100%' }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentAdminUser = authSelector.selectCurAdminUser(state)
  let roleNames = authSelector.selectUserRoleName(state, currentAdminUser.roles)

  let mpUserStat = dashboardSelector.selectMpUserStat(state)
  let deviceStat = dashboardSelector.selectDeviceStat(state)

  return {
    currentAdminUser,
    roleNames,
    mpUserStat,
    deviceStat,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
