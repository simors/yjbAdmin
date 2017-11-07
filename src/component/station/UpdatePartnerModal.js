/**
 * Created by lilu on 2017/9/25.
 */


import AV from 'leancloud-storage'
import React, {PropTypes, Component} from 'react'
import {Form, Input, InputNumber, Radio, Modal, Checkbox, Upload, Table, Icon, Button, Select} from 'antd'
import mathjs from 'mathjs'
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
class UpdatePartnerModal extends Component {
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
        return <Option key={key} value={item.id}>{item.nickname+'  '+item.mobilePhoneNumber}</Option>
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


  handleOk() {

    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      // console.log('=======>',{...this.props.form.getFieldsValue()})
      let data = this.props.form.getFieldsValue()
      // console.log('data======>',data)
      // let count = this.state.count - 1
      data.royalty = mathjs.chain(data.royalty).multiply(1/100).done()
      this.props.onOk(data)
    })
  }

  hasErrors(fieldsError, values, balance) {
    if (Object.keys(fieldsError).some(field => fieldsError[field])) {
      return true
    }
    let isValid = values['userId'] && values['royalty'] >= 0 && values['royalty']<=100
    return !isValid
  }

  render() {
    const { getFieldDecorator, getFieldsValue, getFieldsError } = this.props.form

    return (
      <Modal
        title='编辑分成方'
        visible={this.props.modalVisible}
        onOk={(data)=> {
          this.handleOk(data)
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
          <FormItem label='分成方' hasFeedback {...formItemLayout}>
            {this.props.form.getFieldDecorator('userId', {
              // getValueFromEvent:(e)=>{
              //  let value=this.setTrimValue(e.target.value)
              //  return value
              //},
              initialValue: this.props.partner ? this.props.partner.shareholderId : '',
              rules: [
                {
                  required: true,
                  message: '分成方未选择'
                }
              ]
            })(
              <Select allowClear={true} style={{width: 200}} disabled={true}>
                {this.userList()}
              </Select>
            )}
          </FormItem>
          <FormItem label='分成比例：' hasFeedback {...formItemLayout}>
            {this.props.form.getFieldDecorator('royalty', {
              initialValue: this.props.partner ? this.props.partner.royalty*100 : 0,
              rules: [
                {
                  required: true,
                  message: '投资金额未填写'
                }
              ]
            })(<InputNumber max={100} min={0} />)}
            <span className="ant-form-text">%</span>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}


export default Form.create()(UpdatePartnerModal)
