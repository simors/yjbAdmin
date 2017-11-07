/**
 * Created by yangyang on 2017/10/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import { Card, Row, Col } from 'antd'
import {profitAction, profitSelector} from './redux'
import {PROFIT_SHARE_TYPE, stationSelector} from '../station'

class InvestorProfitShare extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getProfitSharing({type: PROFIT_SHARE_TYPE.INVESTOR_SHARE_TYPE})
  }

  render() {
    let {profitShares} = this.props
    if (!profitShares) {
      return null
    }
    const gridStyle = {
      width: '25%',
      textAlign: 'center',
    };
    return (
      <div>
        <Card title="成本与收益率">
          {
            profitShares.map((share, key) => {
              return (
                <Card.Grid key={key} style={gridStyle}>
                  <Row>
                    <Col span={8}>服务点</Col>
                    <Col span={16}>{share.stationName}</Col>
                  </Row>
                  <Row>
                    <Col span={8}>投资金额</Col>
                    <Col span={16}>¥{share.investment}元</Col>
                  </Row>
                  <Row>
                    <Col span={8}>分红比例</Col>
                    <Col span={16}>{Number(share.royalty) * 100}%</Col>
                  </Row>
                </Card.Grid>
              )
            })
          }
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let profitIds = profitSelector.selectProfitShareIdList(state, PROFIT_SHARE_TYPE.INVESTOR_SHARE_TYPE)
  let profitShares = []
  profitIds.forEach((profitId) => {
    profitShares.push(stationSelector.selectInvestorById(state, profitId))
  })
  return {
    profitShares,
  }
}

const mapDispatchToProps = {
  ...profitAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(InvestorProfitShare)