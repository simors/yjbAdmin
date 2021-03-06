/**
 * Created by yangyang on 2017/10/18.
 */
import React from 'react'
import {connect} from 'react-redux'
import { Row, Col, Tabs } from 'antd'
import {withRouter} from 'react-router-dom'
import WalletBar from './WalletBar'
import InvestProfitChart from './InvestProfitChart'
import ParticipationProfitChart from './ParticipationProfitChart'
import Withdraw from './Withdraw'
import {selector as authSelector} from '../../util/auth'
import {ROLE_CODE} from '../../util/rolePermission'

const TabPane = Tabs.TabPane

class Profit extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showWithdraw: false,
    }
  }

  tabSelect = (key) => {
    console.log('key', key)
  }

  renderInvestTab() {
    let {isInvestor} = this.props
    if (isInvestor) {
      return (
        <TabPane tab="投资收益" key="1">
          <InvestProfitChart/>
        </TabPane>
      )
    }
    return null
  }

  renderDividendTab() {
    let {isProvider} = this.props
    if (isProvider) {
      return (
        <TabPane tab="服务分成收益" key="2">
          <ParticipationProfitChart/>
        </TabPane>
      )
    }
    return null
  }

  render() {
    return (
      <div>
        <WalletBar onClick={() => this.setState({showWithdraw: true})}/>
        <div style={{marginTop: 20}}>
          <Tabs onChange={this.tabSelect} type="card">
            {this.renderInvestTab()}
            {this.renderDividendTab()}
          </Tabs>
        </div>
        {
          this.state.showWithdraw ? <Withdraw onCancel={() => this.setState({showWithdraw: false})} /> : null
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let userInfo = authSelector.selectCurUser(state)
  let isInvestor = authSelector.selectValidRoles(state, [ROLE_CODE.STATION_INVESTOR])
  let isProvider = authSelector.selectValidRoles(state, [ROLE_CODE.STATION_PROVIDER])
  return {
    userInfo,
    isInvestor: isInvestor,
    isProvider: isProvider,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profit))
