/**
 * Created by yangyang on 2017/11/3.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Card} from 'antd'
import {dashboardAction, dashboardSelector} from './redux'

class ProfitCost extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.requestPlatformProfitStat({})
  }

  renderTitleExtra(data, unit) {
    return (
      <div>
        <span style={{fontSize: 22}}>{Number(data).toLocaleString()}</span>
        <span style={{fontSize: 12, marginLeft: 8}}>{unit}</span>
      </div>
    )
  }

  renderCardContent(dayData, monthData, yearData) {
    return (
      <Row>
        <Col span={8}>
          <div style={{textAlign: 'center', fontSize: 14}}>日新增</div>
          <div style={{textAlign: 'center', fontSize: 14}}>{Number(dayData).toLocaleString()}</div>
        </Col>
        <Col span={8}>
          <div style={{textAlign: 'center', fontSize: 14}}>月新增</div>
          <div style={{textAlign: 'center', fontSize: 14}}>{Number(monthData).toLocaleString()}</div>
        </Col>
        <Col span={8}>
          <div style={{textAlign: 'center', fontSize: 14}}>年新增</div>
          <div style={{textAlign: 'center', fontSize: 14}}>{Number(yearData).toLocaleString()}</div>
        </Col>
      </Row>
    )
  }

  render() {
    let {platformProfit} = this.props
    if (!platformProfit
      || !platformProfit.platformAccount
      || !platformProfit.lastDayPlatformAccount
      || !platformProfit.lastMonthPlatformAccount
      || !platformProfit.lastYearPlatformAccount) {
      return null
    }
    let platformAccount = platformProfit.platformAccount
    let lastDayPlatformAccount = platformProfit.lastDayPlatformAccount
    let lastMonthPlatformAccount = platformProfit.lastMonthPlatformAccount
    let lastYearPlatformAccount = platformProfit.lastYearPlatformAccount
    return (
      <div>
        <Row gutter={16} style={{marginBottom: 20}}>
          <Col span={8}>
            <Card title="营业额" extra={this.renderTitleExtra(platformAccount.incoming || 0, '元')} style={{ width: '100%' }}>
              {this.renderCardContent(lastDayPlatformAccount.incoming || 0, lastMonthPlatformAccount.incoming || 0, lastYearPlatformAccount.incoming || 0)}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="纯利润" extra={this.renderTitleExtra(platformAccount.profit || 0, '元')} style={{ width: '100%' }}>
              {this.renderCardContent(lastDayPlatformAccount.profit || 0, lastMonthPlatformAccount.profit || 0, lastYearPlatformAccount.profit || 0)}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="电费成本" extra={this.renderTitleExtra(platformAccount.cost || 0, '元')} style={{ width: '100%' }}>
              {this.renderCardContent(lastDayPlatformAccount.cost || 0, lastMonthPlatformAccount.cost || 0, lastYearPlatformAccount.cost || 0)}
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: 20}}>
          <Col span={8}>
            <Card title="平台分成" extra={this.renderTitleExtra(platformAccount.platformProfit || 0, '元')} style={{ width: '100%' }}>
              {this.renderCardContent(lastDayPlatformAccount.platformProfit || 0, lastMonthPlatformAccount.platformProfit || 0, lastYearPlatformAccount.platformProfit || 0)}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="服务单位分成" extra={this.renderTitleExtra(platformAccount.partnerProfit || 0, '元')} style={{ width: '100%' }}>
              {this.renderCardContent(lastDayPlatformAccount.partnerProfit || 0, lastMonthPlatformAccount.partnerProfit || 0, lastYearPlatformAccount.partnerProfit || 0)}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="投资人分成" extra={this.renderTitleExtra(platformAccount.investorProfit || 0, '元')} style={{ width: '100%' }}>
              {this.renderCardContent(lastDayPlatformAccount.investorProfit || 0, lastMonthPlatformAccount.investorProfit || 0, lastYearPlatformAccount.investorProfit || 0)}
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let platformProfit = dashboardSelector.selectPlatformProfitStat(state)
  return {
    platformProfit,
  }
}

const mapDispatchToProps = {
  ...dashboardAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfitCost)