/**
 * Created by yangyang on 2017/11/3.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Card} from 'antd'
import {dashboardAction, dashboardSelector} from './redux'

class StationProfitRank extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Card title="每日服务点收益排行榜">
          <Row style={{marginBottom: 5}}>
            <Col span={18}>1、中南大学</Col>
            <Col span={6}>233.52</Col>
          </Row>
          <Row style={{marginBottom: 5}}>
            <Col span={18}>2、麓谷企业广场</Col>
            <Col span={6}>5332.52</Col>
          </Row>
          <Row style={{marginBottom: 5}}>
            <Col span={18}>3、麓谷国际工业园</Col>
            <Col span={6}>233.52</Col>
          </Row>
          <Row style={{marginBottom: 5}}>
            <Col span={18}>4、润和紫郡</Col>
            <Col span={6}>233.52</Col>
          </Row>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...dashboardAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(StationProfitRank)