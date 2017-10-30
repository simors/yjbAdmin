/**
 * Created by yangyang on 2017/10/31.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Card} from 'antd'
import {dashboardAction, dashboardSelector} from './redux'

class DeviceStat extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.requestDeviceStat({})
  }

  renderTitleExtra() {
    let {deviceStat} = this.props
    if (!deviceStat) {
      return null
    }
    return (
      <div>
        <span style={{fontSize: 22}}>{Number(deviceStat.deviceCount).toLocaleString()}</span>
        <span style={{fontSize: 12, marginLeft: 8}}>台</span>
      </div>
    )
  }

  renderCardContent() {
    let {deviceStat} = this.props
    if (!deviceStat) {
      return null
    }
    return (
      <Row>
        <Col span={8}>
          <div style={{textAlign: 'center', fontSize: 14}}>日新增</div>
          <div style={{textAlign: 'center', fontSize: 14}}>{Number(deviceStat.lastDayDeviceCount).toLocaleString()}</div>
        </Col>
        <Col span={8}>
          <div style={{textAlign: 'center', fontSize: 14}}>月新增</div>
          <div style={{textAlign: 'center', fontSize: 14}}>{Number(deviceStat.lastMonthDeviceCount).toLocaleString()}</div>
        </Col>
        <Col span={8}>
          <div style={{textAlign: 'center', fontSize: 14}}>年新增</div>
          <div style={{textAlign: 'center', fontSize: 14}}>{Number(deviceStat.lastYearDeviceCount).toLocaleString()}</div>
        </Col>
      </Row>
    )
  }

  render() {
    return (
      <Card title="干衣柜" extra={this.renderTitleExtra()} style={{ width: '100%' }}>
        {this.renderCardContent()}
      </Card>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let deviceStat = dashboardSelector.selectDeviceStat(state)
  return {
    deviceStat
  }
}

const mapDispatchToProps = {
  ...dashboardAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceStat)