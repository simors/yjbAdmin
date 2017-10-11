/**
 * Created by wanpeng on 2017/10/10.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {
  Button,
  Table,
  Row,
  Form,
  Input,
  DatePicker,
} from 'antd'
import style from './promotion.module.scss'
import DivisionCascader from '../../component/DivisionCascader'
import AwardsInput from './AwardsInput'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const TextArea = Input.TextArea


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class PublishForm extends PureComponent {
  constructor(props) {
    super(props)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const rangeTimeValue = fieldsValue['rangeTimePicker']
      const values = {
        ...fieldsValue,
        'rangeTimePicker': [
          rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
          rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
        ],
      }
      console.log("handleSubmit values:", values)
    })
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldsValue } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="活动名称">
          {getFieldDecorator("name", {
            rules: [{ required: true, message: '请输入活动名称'}],
          })(
            <Input style={{ width: '30%' }}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="活动时间">
          {getFieldDecorator("rangeTimePicker", {
            rules: [{ type: 'array', required: true, message: '请输入活动起始时间' }],
          })(
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="活动区域">
          {getFieldDecorator("division", {
            rules: [{ type: 'array', required: true, message: '请输入活动生效区域' }],
            initialValue: ['430000', '430100', '430104'],
          })(
            <DivisionCascader />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="奖励金额">
          {getFieldDecorator("awards", {
            rules: [{ type: 'array', required: true, message: '请输入奖励金额' }],
          })(
            <AwardsInput />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="活动说明">
          {getFieldDecorator("description", {
            rules: [{ required: true, message: '请输入活动名称'}],
          })(
            <TextArea placeholder="描述活动" />
          )}
        </FormItem>
        <FormItem wrapperCol={{offset: 10}}>
          <Button type="primary" htmlType="submit"
                  disabled={hasErrors(getFieldsError())}>
            发布
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const RechargePublishForm = Form.create()(PublishForm)

class RechargePromotion extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={style.content}>
        <RechargePublishForm />
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RechargePromotion))
