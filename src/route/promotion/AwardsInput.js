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
    const value = props.value
    this.state = {
      awards: value,
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState({awards: value})
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

  renderRemoveIcon(index) {
    if(this.props.disabled) {
      return null
    }
    return (
      <Icon
        className="dynamic-delete-button"
        type="minus-circle-o"
        onClick={() => this.remove(index)}
      />
    )
  }

  renderPlusButton() {
    if(this.props.disabled) {
      return null
    }
    return (
      <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
        <Icon type="plus" /> 增加
      </Button>
    )
  }

  render() {
    const state = this.state
    const {disabled} = this.props
    const inputItems = state.awards.map((k, index) => {
      return (
        <Row key={index} gutter={16}>
          <Col span={10}>
            <Input disabled={disabled}
                   value={state.awards[index].recharge}
                   addonBefore='充值金额'
                   addonAfter="¥"
                   type='number'
                   onChange={(e) => this.triggerChange(index, 'recharge', e)}/>
          </Col>
          <Col span={10}>
            <Input disabled={disabled}
                   value={state.awards[index].award}
                   addonBefore='奖励金额'
                   addonAfter="¥" type='number'
                   onChange={(e) => this.triggerChange(index, 'award', e)}/>
          </Col>
          <Col>
            {this.renderRemoveIcon(index)}
          </Col>
        </Row>

      )
    })
    return (
      <div>
        {inputItems}
        {this.renderPlusButton()}
      </div>
    )
  }
}

AwardsInput.defaultProps = {
  disabled: false,
}

export default AwardsInput
