/**
 * Created by lilu on 2017/9/21.
 */

import AV from 'leancloud-storage'
import React, {PropTypes, Component} from 'react'
import {Form, Input, InputNumber, Radio, Modal, Checkbox, Upload, Table, Icon, Button, Select} from 'antd'
import AdminSelectByRole from '../../component/AdminSelectByRole'
import {ROLE_CODE,PERMISSION_CODE} from '../../util/rolePermission'
import StationSelect from '../../route/station/StationSelect'

//import {checkBox} from '../../common/checkBox'
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
}
class CreateInvestorModal extends Component {
  constructor(props) {
    super(props)

    // console.log('rednder')
    this.state = {
      color: '#000000',
      pickerOpen: false,
      count: -1,
      visible: false,
      fileList: [],
      imageList: [],
      selectedRowKeys: [],
      selectTags: [],
      tagList: [],
      newTag: ''
    }
  }

  componentWillReceiveProps(newProps) {
  }

  componentDidMount() {
    // console.log('data', this.props.data
  }

  userList() {
    if (this.props.userList && this.props.userList.length > 0) {
      let userList = this.props.userList.map((item, key)=> {
        return <Option key={key} value={item.id}>{item.nickname+'  '+ item.mobilePhoneNumber}</Option>
      })
      return userList
    } else {
      return null
    }
  }

  stationList() {
    if (this.props.stationList && this.props.stationList.length > 0) {
      let stationList = this.props.stationList.map((item, key)=> {
        return <Option key={key} value={item.id}>{item.name}</Option>
      })
      return stationList
    } else {
      return null
    }
  }

  hasErrors(fieldsError, values, balance) {
    if (Object.keys(fieldsError).some(field => fieldsError[field])) {
      return true
    }
    let isValid = values['investment'] > 0
    return !isValid
  }


  handleOk() {

    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      // console.log('=======>',{...this.props.form.getFieldsValue()})
      let data = this.props.form.getFieldsValue()
      console.log('data======>',data)
      // let count = this.state.count - 1
      this.props.onOk(data)
    })
  }


  render() {
    const { getFieldDecorator, getFieldsValue, getFieldsError } = this.props.form
    return (
      <Modal
        title='新建投资人'
        visible={this.props.modalVisible}
        onOk={()=> {
          this.handleOk()
        }}
        onCancel={()=> {
          this.setState({})
          this.props.onCancel()
        }}
        wrapClassName='vertical-center-modal'
        key={this.props.modalKey}
        footer={[
          <Button key="back" size="large" onClick={()=> {
            this.setState({})
            this.props.onCancel()
          }}>取消</Button>,
          <Button key="submit" disabled={this.hasErrors(getFieldsError(), getFieldsValue())} type="primary" size="large"  onClick={()=> {
            this.handleOk()
          }}>
            确定
          </Button>,
        ]}
      >
        <Form layout="horizontal">
          <FormItem label='投资人' hasFeedback {...formItemLayout}>
            {this.props.form.getFieldDecorator('userId', {
              rules: [
                {
                  required: true,
                  message: '投资人未选择'
                }
              ]
            })(
              <AdminSelectByRole roleCode={ROLE_CODE.STATION_INVESTOR} />
            )}
          </FormItem>
          <FormItem label='投资服务点：' hasFeedback {...formItemLayout}>
            {this.props.form.getFieldDecorator('stationId', {
              rules: [
                {
                  required: true,
                  message: '投资服务点未选择'
                }
              ]
            })(<StationSelect placeholder='请选择服务点' disabled={false}/>)}
          </FormItem>
          <FormItem label='投资金额：' hasFeedback {...formItemLayout}>
            {this.props.form.getFieldDecorator('investment', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: '投资金额未填写'
                }
              ]
            })(<InputNumber min={0}/>)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}


export default Form.create()(CreateInvestorModal)
