/**
 * Created by yangyang on 2017/10/30.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Card} from 'antd'
import {dashboardAction, dashboardSelector} from './redux'

class MpUserStat extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.requestMpUserStat({})
  }

  renderTitleExtra() {
    let {mpUserStat} = this.props
    if (!mpUserStat) {
      return null
    }
    return (
      <div>
        <span style={{fontSize: 22}}>{Number(mpUserStat.mpUserCount).toLocaleString()}</span>
        <span style={{fontSize: 12, marginLeft: 8}}>人</span>
      </div>
    )
  }

  renderCardContent() {
    let {mpUserStat} = this.props
    if (!mpUserStat) {
      return null
    }
    return (
      <Row>
        <Col span={8}>
          <div style={{textAlign: 'center', fontSize: 14}}>日新增</div>
          <div style={{textAlign: 'center', fontSize: 14}}>{Number(mpUserStat.lastDayMpCount).toLocaleString()}</div>
        </Col>
        <Col span={8}>
          <div style={{textAlign: 'center', fontSize: 14}}>月新增</div>
          <div style={{textAlign: 'center', fontSize: 14}}>{Number(mpUserStat.lastMonthMpCount).toLocaleString()}</div>
        </Col>
        <Col span={8}>
          <div style={{textAlign: 'center', fontSize: 14}}>年新增</div>
          <div style={{textAlign: 'center', fontSize: 14}}>{Number(mpUserStat.lastYearMpCount).toLocaleString()}</div>
        </Col>
      </Row>
    )
  }

  render() {
    return (
      <Card title="用户数" extra={this.renderTitleExtra()} style={{ width: '100%' }}>
        {this.renderCardContent()}
      </Card>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let mpUserStat = dashboardSelector.selectMpUserStat(state)
  return {
    mpUserStat
  }
}

const mapDispatchToProps = {
  ...dashboardAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(MpUserStat)
