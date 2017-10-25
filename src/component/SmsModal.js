/**
 * Created by lilu on 2017/10/21.
 */

import React from 'react'
import {Form, Input, InputNumber, Radio, Modal, Checkbox,Row,Col} from 'antd'
import SmsInput from './SmsInput'
import {action as authAction,selector as authSelector} from '../util/auth'
import {connect} from 'react-redux'
import {ROLE_CODE} from '../util/rolePermission'

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
  componentWillMount(){
    this.props.listUsersByRole({roleCode: ROLE_CODE.SYS_MANAGER})
  }

  componentDidMount() {
    this.setState({visible: !!this.props.visible})
    console.log(...this.props)
  }

  handleOk() {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = this.props.form.getFieldsValue()
      let payload = {
        success: ()=>{this.props.onOk()},
        smsCode: data.smsCode,
        phone: this.props.currentUser.mobilePhoneNumber,
        error: (e)=>{this.props.error(e)}
      }
      this.props.verifySmsCode(payload)

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
              <SmsInput params={{mobilePhoneNumber:this.props.currentUser.mobilePhoneNumber,name:this.props.currentUser.idName,op:this.props.op }}/>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let sysManager = authSelector.selectUsersByRole(state,ROLE_CODE.SYS_MANAGER)
  let currentUser = authSelector.selectCurAdminUser(state)
  return {
    sysManager: sysManager[0],
    currentUser: currentUser
  }
};

const mapDispatchToProps = {
  ...authAction
};

export default Form.create()(connect(mapStateToProps,mapDispatchToProps)(SmsModal))

