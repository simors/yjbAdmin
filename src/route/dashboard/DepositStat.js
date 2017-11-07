/**
 * Created by yangyang on 2017/11/7.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Card} from 'antd'
import {dashboardAction, dashboardSelector} from './redux'

class DepositStat extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.requestDepositStat({})
  }

  render() {
    let {depositStat} = this.props
    return (
      <Card title="押金池总额">
        <div style={{textAlign: 'center'}}>
          <span style={{fontSize: 22, marginRight: 5}}>¥ {Number(depositStat).toLocaleString()}</span>
          <span style={{fontSize: 12}}>元</span>
        </div>
      </Card>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let depositStat = dashboardSelector.selectDepositStat(state)
  return {
    depositStat,
  }
}

const mapDispatchToProps = {
  ...dashboardAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositStat)