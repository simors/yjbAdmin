/**
 * Created by yangyang on 2017/10/30.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Row, Col, Card} from 'antd';
import {selector as authSelector} from '../../util/auth'
import {ROLE_CODE} from '../../util/rolePermission'
import MpUserStat from './MpUserStat'
import DeviceStat from './DeviceStat'
import StationStat from './StationStat'
import ProfitCost from './ProfitCost'
import StationProfitRank from './StationProfitRank'
import DepositStat from './DepositStat'
import RechargeStat from './RechargeStat'
import {dashboardSelector} from './redux'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  renderHeader() {
    let {currentAdminUser, roleNames, mpUserStat, deviceStat, stationStat} = this.props
    if (!currentAdminUser || !roleNames || !mpUserStat || !deviceStat || !stationStat) {
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
              <span style={{fontSize: 22}}>{Number(stationStat.stationCount).toLocaleString()}</span>
              <span style={{fontSize: 12, marginLeft: 5}}>个</span>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  renderFundStat() {
    return (
      <Row gutter={16} style={{marginBottom: 20}}>
        <Col span={12}>
          <DepositStat/>
        </Col>
        <Col span={12}>
          <RechargeStat/>
        </Col>
      </Row>
    )
  }

  render() {
    let {isPlatformUser} = this.props
    return (
      <div>
        {this.renderHeader()}
        <hr/>
        <div>
          <Row gutter={16}>
            <Col span={18}>
              {isPlatformUser ? this.renderFundStat() : null}
              {isPlatformUser ? <ProfitCost/> : null}
              <Row gutter={16} style={{marginBottom: 20}}>
                <Col span={8}>
                  <MpUserStat/>
                </Col>
                <Col span={8}>
                  <DeviceStat/>
                </Col>
                <Col span={8}>
                  <StationStat/>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <StationProfitRank/>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentAdminUser = authSelector.selectCurUser(state)
  let roleNames = authSelector.selectUserRoleName(state, currentAdminUser.roles)
  let isPlatformUser = authSelector.selectValidRoles(state, [ROLE_CODE.PLATFORM_MANAGER])

  let mpUserStat = dashboardSelector.selectMpUserStat(state)
  let deviceStat = dashboardSelector.selectDeviceStat(state)
  let stationStat = dashboardSelector.selectStationStat(state)

  return {
    currentAdminUser,
    roleNames,
    isPlatformUser,
    mpUserStat,
    deviceStat,
    stationStat,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
