/**
 * Created by lilu on 2017/10/21.
 */

import React from 'react'
import {Table, Popconfirm, Input,Button,message} from 'antd'
import {connect} from 'react-redux';
import {action as authAction,selector} from '../util/auth'

class SmsInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      countDown: 0
    }
  }

  countDown = () => {
    this.interval = setInterval(()=> {
      this.setState({countDown: this.state.countDown - 1})
    }, 1000)
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval)
  }

  renderCodeFetcher = () => {
    if (this.state.countDown) {
      return (this.state.countDown + 's后重新获取')


    } else {
      this.interval && clearInterval(this.interval)
      return (this.props.getSmsAuthText)

    }
  }

  requestSmsCodeSuccess(){
    let {smsType} = this.props
    if (smsType === 'sms') {
      message.success('验证码已经发送，请查收！')
    } else if (smsType === 'auth') {
      message.success('授权码已发送，请向系统管理员索取！')
    }
  }

  requestSmsCodeError(){
    message.error('发送失败，请过会儿再发！')
  }

  requestSmsCode = () => {
    let {smsType, params} = this.props

    if (smsType === 'sms') {
      let {mobilePhoneNumber, name, op} = params
      this.props.requestSmsCode({
        mobilePhoneNumber,
        name,
        op,
        success:()=>{this.requestSmsCodeSuccess()},
        error:()=>{this.requestSmsCodeError()},
      })
    } else if (smsType === 'auth') {
      let {adminUser, opName} = params
      this.props.requestSysAuthCode({
        operator: adminUser,
        operation: opName,
        success:()=>{this.requestSmsCodeSuccess()},
        error:()=>{this.requestSmsCodeError()},
      })
    }
  }

  getSmsAuthCode = () => {
    if (this.props.reset) {
      this.setState({countDown: 0})
    } else {
      this.setState({countDown: this.props.countTimes})
      this.countDown()
    }
    this.requestSmsCode()
  }

  renderGetSmsButtonEnabled = () => {
    return (
      <Button onClick={this.state.countDown ? ()=> {} : this.getSmsAuthCode}
      >
        {this.renderCodeFetcher()}
      </Button>
    )
  }

  renderGetSmsButtonDisabled = () => {
    return (
      <div>
        {this.renderCodeFetcher()}
      </div>
    )
  }

  render() {
    return (
      <div>
        {/*<Input*/}
        {/*placeholder={this.props.placeholder}*/}
        {/*/>*/}
        {this.state.countDown ? this.renderGetSmsButtonDisabled() : this.renderGetSmsButtonEnabled()}
      </div>
    )
  }

}

SmsInput.defaultProps = {
  getSmsAuthText: '获取验证码',
  smsType: 'sms',

  //text input
  placeholder: '请输入6位验证码',
  placeholderTextColor: '#E1E1E1',
  maxLength: 6,
  autoFocus: false,
  countTimes: 60,
}

const mapStateToProps = (state, ownProps) => {
  return {}
};

const mapDispatchToProps = {
  ...authAction
};

export default connect(mapStateToProps,mapDispatchToProps)(SmsInput)

