/**
 * Created by yangyang on 2017/10/31.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Card} from 'antd'
import {dashboardAction, dashboardSelector} from './redux'

class StationStat extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.requestStationStat({})
  }

  renderTitleExtra() {
    let {stationStat} = this.props
    if (!stationStat) {
      return null
    }
    return (
      <div>
        <span style={{fontSize: 22}}>{Number(stationStat.stationCount).toLocaleString()}</span>
        <span style={{fontSize: 12, marginLeft: 8}}>个</span>
      </div>
    )
  }

  renderCardContent() {
    let {stationStat} = this.props
    if (!stationStat) {
      return null
    }
    return (
      <Row>
        <Col span={8}>
          <div style={{textAlign: 'center', fontSize: 14}}>日新增</div>
          <div style={{textAlign: 'center', fontSize: 14}}>{Number(stationStat.lastDayStationCount).toLocaleString()}</div>
        </Col>
        <Col span={8}>
          <div style={{textAlign: 'center', fontSize: 14}}>月新增</div>
          <div style={{textAlign: 'center', fontSize: 14}}>{Number(stationStat.lastMonthStationCount).toLocaleString()}</div>
        </Col>
        <Col span={8}>
          <div style={{textAlign: 'center', fontSize: 14}}>年新增</div>
          <div style={{textAlign: 'center', fontSize: 14}}>{Number(stationStat.lastYearStationCount).toLocaleString()}</div>
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
  let stationStat = dashboardSelector.selectStationStat(state)
  return {
    stationStat
  }
}

const mapDispatchToProps = {
  ...dashboardAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(StationStat)