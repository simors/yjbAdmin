/**
 * Created by lilu on 2017/9/22.
 */
/**
 * Created by lilu on 2017/9/21.
 */

import AV from 'leancloud-storage'
import React, {PropTypes, Component} from 'react'
import {
  Row,
  Col,
  message,
  Form,
  Input,
  InputNumber,
  Radio,
  Modal,
  Checkbox,
  Upload,
  Table,
  Icon,
  Button,
  Select
} from 'antd'

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
class UpdateInvestorModal extends Component {
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
      newTag: '',
      station: undefined,
      user: undefined
    }
  }


  componentWillReceiveProps(newProps) {
  }

  componentDidMount() {
    // this.props.form.validateFields((errors) => {
    //   if (errors) {
    //     return
    //   }
    //   // console.log('=======>',{...this.props.form.getFieldsValue()})
    //   let data =this.props.form.getFieldsValue()
    //   console.log('data======>',data)
    //   // let count = this.state.count - 1
    //   let user = {}
    //   this.props.userList.forEach((item)=>{
    //     if(item.id==data.userId){}
    //     user = item
    //   })
    //   let station = {}
    //   this.props.stationList.forEach((item)=>{
    //     if(item.id==data.stationId){}
    //     station = item
    //   })
    //   this.setState({user: user, station: station})
    // })
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
      this.props.onOk(data)
    })
  }


  render() {
    let investor = this.props.investor
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
        okText="提交"
        wrapClassName='vertical-center-modal'
        key={this.props.modalKey}
      >
        <Form layout="horizontal">
          <FormItem label='投资人' hasFeedback {...formItemLayout}>
            {this.props.form.getFieldDecorator('userId', {
              initialValue: investor ? investor.shareholderId : undefined,
              rules: [
                {
                  required: true,
                  message: '投资人未选择'
                }
              ]
            })(
              <Select allowClear={true} style={{width: 200}} disabled = {true}>
                {this.userList()}
              </Select>
            )}
          </FormItem>
          <FormItem label='投资服务点：' hasFeedback {...formItemLayout}>
            {this.props.form.getFieldDecorator('stationId', {
              initialValue: investor ? investor.stationId : undefined,
              rules: [
                {
                  required: true,
                  message: '投资服务点未选择'
                }
              ]
            })(<Select allowClear={true} style={{width: 200}} disabled = {true}>
              {this.stationList()}
            </Select>)}
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem label='投资金额：' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('investment', {
                  initialValue: investor ? investor.investment : undefined,
                  rules: [
                    {
                      required: true,
                      message: '投资金额未填写'
                    }
                  ]
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <p
                style={{color: 'grey'}}>{'投资占比：' + (this.props.investor ? this.props.investor.royalty * 100 + '%' : '')}</p>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}


export default Form.create()(UpdateInvestorModal)
