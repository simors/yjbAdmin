/**
 * Created by yangyang on 2017/11/3.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Card} from 'antd';

class ProfitCost extends React.Component {
  constructor(props) {
    super(props)
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
    return (
      <div>
        <Row gutter={16} style={{marginBottom: 20}}>
          <Col span={8}>
            <Card title="营业额" extra={this.renderTitleExtra(0, '元')} style={{ width: '100%' }}>
              {this.renderCardContent(0, 0, 0)}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="纯利润" extra={this.renderTitleExtra(0, '元')} style={{ width: '100%' }}>
              {this.renderCardContent(0, 0, 0)}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="电费成本" extra={this.renderTitleExtra(0, '元')} style={{ width: '100%' }}>
              {this.renderCardContent(0, 0, 0)}
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: 20}}>
          <Col span={8}>
            <Card title="平台分成" extra={this.renderTitleExtra(0, '元')} style={{ width: '100%' }}>
              {this.renderCardContent(0, 0, 0)}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="服务单位分成" extra={this.renderTitleExtra(0, '元')} style={{ width: '100%' }}>
              {this.renderCardContent(0, 0, 0)}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="投资人分成" extra={this.renderTitleExtra(0, '元')} style={{ width: '100%' }}>
              {this.renderCardContent(0, 0, 0)}
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  return {
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfitCost)