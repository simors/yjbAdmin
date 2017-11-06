/**
 * Created by yangyang on 2017/11/3.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Card} from 'antd'
import {dashboardAction, dashboardSelector} from './redux'
import moment from 'moment'

class StationProfitRank extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.requestStationAccountRank({rankDate: moment().subtract(1, 'days').format('YYYY-MM-DD')})
  }

  render() {
    let {stationRank} = this.props
    return (
      <div>
        <Card title="服务点昨日收益排行榜">
          {
            stationRank.map((rank, key) => {
              return (
                <Row key={key} style={{marginBottom: 5}}>
                  <Col span={18}>{key+1}、{rank.station.name}</Col>
                  <Col span={6}>{Number(rank.incoming).toLocaleString()}</Col>
                </Row>
              )
            })
          }
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let stationRank = dashboardSelector.selectStationAccountList(state)
  return {
    stationRank,
  }
}

const mapDispatchToProps = {
  ...dashboardAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(StationProfitRank)