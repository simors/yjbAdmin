/**
 * Created by wanpeng on 2017/10/10.
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


class AwardsInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      awards: []
    }
  }

  remove = (index) => {
    let awards = this.state.awards

    awards.splice(index, 1)
    this.setState({awards: awards})
  }

  add = () => {
    if(this.state.awards.length < 5) {
      this.setState({
        awards: this.state.awards.concat({recharge: undefined, award: undefined})
      })
    } else {
      message.warning("奖励金额参数超限")
    }
  }

  triggerChange(index, type, e) {
    const onChange = this.props.onChange
    const { value } = e.target
    if (isNaN(value)) {
      return
    }
    let awards = this.state.awards
    awards[index][type] = value
    this.setState({
      awards: awards
    })
    if(onChange) {
      onChange(awards)
    }
  }

  render() {
    const inputItems = this.state.awards.map((k, index) => {
      return (
        <Row key={index} gutter={16}>
          <Col span={8}>
            <Input value={this.state.awards[index].recharge} addonBefore='充值金额' addonAfter="¥" type='number'
                   onChange={(e) => this.triggerChange(index, 'recharge', e)}/>
          </Col>
          <Col span={8}>
            <Input value={this.state.awards[index].award} addonBefore='奖励金额' addonAfter="¥" type='number'
                   onChange={(e) => this.triggerChange(index, 'award', e)}/>
          </Col>
          <Col>
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(index)}
            />
          </Col>
        </Row>

      )
    })
    return (
      <div>
        {inputItems}
        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
          <Icon type="plus" /> 增加
        </Button>
      </div>
    )
  }
}

export default AwardsInput
