/**
 * Created by wanpeng on 2017/10/23.
 */
import React, {PureComponent, Component} from 'react'
import {
  Button,
  Row,
  Col,
  Input,
  Icon,
  message,
} from 'antd'

class RedEnvelopeParamsInput extends PureComponent {
  constructor(props) {
    super(props)
    const value = this.props.value || {};
    this.state = {
      awardAmount: value.awardAmount || 0, //红包总金额
      awardMax: value.awardMax || 0,       //单个红包最大金额
      count: value.count || 0,             //红包总数
      userLimit: value.userLimit || 1      //单个用户领取次数
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value || {}
      this.setState(value)
    }
  }

  awardAmountChange = (e) => {
    const onChange = this.props.onChange
    const { value } = e.target
    this.setState({awardAmount: value})
    let stat = this.state
    stat.awardAmount = value
    if(onChange) {
      onChange(stat)
    }
  }

  awardMaxChange = (e) => {
    const onChange = this.props.onChange
    const { value } = e.target
    this.setState({awardMax: value})
    let stat = this.state
    stat.awardMax = value
    if(onChange) {
      onChange(stat)
    }
  }

  countChange = (e) => {
    const onChange = this.props.onChange
    const { value } = e.target
    this.setState({count: value})
    let stat = this.state
    stat.count = value
    if(onChange) {
      onChange(stat)
    }
  }

  userLimitChange = (e) => {
    const onChange = this.props.onChange
    const { value } = e.target
    this.setState({userLimit: value})
    let stat = this.state
    stat.userLimit = value
    if(onChange) {
      onChange(stat)
    }
  }

  render() {
    const state = this.state
    const {disabled} = this.props
    return (
      <div>
        <Row>
          <Col span={8}>红包总金额:</Col>
          <Col span={12}>
            <Input type='number'
                   value={state.awardAmount}
                   disabled={disabled}
                   placeholder="红包总金额(元)"
                   addonAfter="¥"
                   onChange={this.awardAmountChange}/>
          </Col>
        </Row>
        <Row>
          <Col span={8}>单个红包最大金额:</Col>
          <Col span={12}>
            <Input type='number'
                   value={state.awardMax}
                   disabled={disabled}
                   placeholder="单个红包最大金额(元)"
                   addonAfter="¥"
                   onChange={this.awardMaxChange}/>
          </Col>
        </Row>
        <Row>
          <Col span={8}>红包总数:</Col>
          <Col span={12}>
            <Input type='number'
                   value={state.count}
                   step={50}
                   disabled={disabled}
                   placeholder="红包总数"
                   onChange={this.countChange}/>
          </Col>
        </Row>
        <Row>
          <Col span={8}>单个用户领取次数:</Col>
          <Col span={12}>
            <Input type='number'
                   value={state.userLimit}
                   disabled={disabled}
                   placeholder="单个用户领取次数"
                   onChange={this.userLimitChange}/>
          </Col>
        </Row>
      </div>
    )
  }
}

RedEnvelopeParamsInput.defaultProps = {
  disabled: false,

}

export default RedEnvelopeParamsInput
