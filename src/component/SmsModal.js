/**
 * Created by lilu on 2017/10/21.
 */

import React from 'react'
import {Form, Input, Modal, Row, Col} from 'antd'
import SmsInput from './SmsInput'
import {action as authAction,selector as authSelector} from '../util/auth'
import {connect} from 'react-redux'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}
class SmsModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      count: 0
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.visible != newProps.visible) {
      this.setState({visible: newProps.visible})
    }
  }

  componentDidMount() {
    this.setState({visible: !!this.props.visible})
  }

  handleOk() {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = this.props.form.getFieldsValue()
      let payload = {
        success: ()=>{this.props.onOk()},
        code: data.smsCode,
        operator: this.props.currentUser.id,
        error: ()=>{
          this.props.error()}
      }
      this.props.verifySysAuthCode(payload)

    })
  }

  render() {
    return (
      <Modal
        title='请联系系统管理员并输入短信验证码'
        visible={true}
        onOk={()=> {
          this.handleOk()
        }}
        onCancel={()=> {
          this.props.onCancel()
        }}
        wrapClassName='vertical-center-modal'
        key={this.props.key}
      >
        <Form style={{flex:1,flexDirection:'row'}}>
          <Row gutter={24}> <Col span={12}><FormItem label='验证码：' hasFeedback {...formItemLayout}>
            {this.props.form.getFieldDecorator('smsCode', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '验证码未填写'
                }
              ]
            })(<Input />)}
          </FormItem>
          </Col>
            <Col span={6}>
              <SmsInput smsType="auth" getSmsAuthText="获取授权码" params={{adminUser:this.props.currentUser.id,opName:this.props.op }}/>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUser = authSelector.selectCurAdminUser(state)
  return {
    currentUser: currentUser
  }
};

const mapDispatchToProps = {
  ...authAction
};

export default Form.create()(connect(mapStateToProps,mapDispatchToProps)(SmsModal))

