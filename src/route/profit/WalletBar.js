/**
 * Created by yangyang on 2017/10/19.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Row, Col, Button, message } from 'antd'
import {profitAction, profitSelector} from './redux'
import {selector as authSelector} from '../../util/auth'
import {ROLE_CODE} from '../../util/rolePermission'

class WalletBar extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getCurrentAdminProfit({
      error: () => {
        message.error('获取收益余额失败')
      }
    })
  }

  toggleModel = () => {
    let {onClick} = this.props
    onClick()
  }

  render() {
    let {adminProfit, isInvestor, isProvider} = this.props
    if (!adminProfit) {
      return null
    }
    return (
      <div>
        <Row>
          <Col span={22}>
            <span style={{marginRight: 10}}>账户余额</span>
            <span style={{color: 'red', marginRight: 30}}>¥ {Number(adminProfit.balance).toFixed(2)}</span>
            {
              isInvestor ? (
                <span>
                  <span style={{marginRight: 10}}>投资总收益</span>
                  <span style={{color: 'red', marginRight: 30}}>¥ {Number(adminProfit.investEarn).toFixed(2)}</span>
                </span>
              ) : null
            }
            {
              isProvider ? (
                <span>
                  <span style={{marginRight: 10}}>分红总收益</span>
                  <span style={{color: 'red', marginRight: 30}}>¥ {Number(adminProfit.providerEarn).toFixed(2)}</span>
                </span>
              ) : null
            }
          </Col>
          <Col span={2}>
            <span><Button type="primary" onClick={this.toggleModel}>取现</Button></span>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let adminProfit = profitSelector.selectAdminProfit(state)
  let isInvestor = authSelector.selectValidRoles(state, [ROLE_CODE.STATION_INVESTOR])
  let isProvider = authSelector.selectValidRoles(state, [ROLE_CODE.STATION_PROVIDER])
  return {
    adminProfit,
    isInvestor,
    isProvider,
  }
}

const mapDispatchToProps = {
  ...profitAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletBar)