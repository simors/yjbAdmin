/**
 * Created by yangyang on 2017/11/7.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Card} from 'antd'
import {dashboardAction, dashboardSelector} from './redux'

class RechargeStat extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.requestRechargeStat({})
  }

  render() {
    let {rechargeStat} = this.props
    return (
      <Card title="充值总金额">
        <div style={{textAlign: 'center'}}>
          <span style={{fontSize: 22, marginRight: 5}}>¥ {Number(rechargeStat).toLocaleString()}</span>
          <span style={{fontSize: 12}}>元</span>
        </div>
      </Card>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let rechargeStat = dashboardSelector.selectRechargeStat(state)
  return {
    rechargeStat,
  }
}

const mapDispatchToProps = {
  ...dashboardAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(RechargeStat)