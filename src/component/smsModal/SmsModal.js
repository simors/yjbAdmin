/**
 * Created by lilu on 2017/10/21.
 */

import React from 'react'
import {Form, Input, Modal, Row, Col} from 'antd'
import SmsInput from './SmsInput'
import {action as authAction,selector as authSelector} from '../../util/auth'
import {connect} from 'react-redux'
import {smsSelector, smsAction} from './redux'

const FormItem = Form.Item
const confirm = Modal.confirm

const formItemLayout = {
  labelCol: {
    span: 12
  },
  wrapperCol: {
    span: 12
  }
}
class SmsModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: true,
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
        success: ()=>{
          this.props.verifySuccess()
          this.props.updateSmsModal({modalVisible: false})
        },
        code: data.smsCode,
        operator: this.props.currentUser.id,
        error: ()=>{
          this.props.verifyError()}
      }
      this.props.verifySysAuthCode(payload)

    })
  }

  showConfirm(){
    confirm({
      title:'确认框',
      content: '确定'+this.props.op+'?',
      onOk:()=>{
        this.handleOk()
      },
      width: 300
    })
  }

  closeModal(){
    let payload = {
      modalVisible: false,
      op: undefined
    }
    this.props.updateSmsModal(payload)
  }

  render() {
    return this.props.modalVisible&&this.state.modalVisible? (

      <Modal style={{zIndex: 100}}
        title='请联系系统管理员并输入短信验证码'
        visible={true}
        onOk={()=> {
          this.showConfirm()
        }}
        onCancel={()=>{
          this.closeModal()
        }

        }
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
    ):null
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUser = authSelector.selectCurAdminUser(state)
  let smsStatus = smsSelector.selectSmsModalState(state)
  console.log('smsStatus======>',smsStatus)
  let {modalVisible,op,verifySuccess,verifyError,closeModal} = smsStatus

  return {
    currentUser: currentUser,
    modalVisible: modalVisible,
    op: op,
    verifySuccess: verifySuccess,
    verifyError: verifyError,
    closeModal: closeModal
  }
};

const mapDispatchToProps = {
  ...authAction,
  ...smsAction,

};

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(SmsModal))

