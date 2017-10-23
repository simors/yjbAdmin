/**
 * Created by wanpeng on 2017/10/23.
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
  Alert,
  message,
} from 'antd'
import style from './promotion.module.scss'
import DivisionCascader from '../../component/DivisionCascader'
import {actions, selector} from './redux'
import * as errno from '../../errno'
import RedEnvelopeParamsInput from './RedEnvelopeParamsInput'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const TextArea = Input.TextArea

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class CreateForm extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.form.validateFields()
  }

  onSubmitError = (error) => {
    switch (error.code) {
      case errno.ERROR_PROM_REPEAT:
        message.error("活动重复")
        break
      case errno.EPERM:
        message.error("用户未登录")
        break
      case error.EINVAL:
        message.error("参数错误")
        break
      default:
        message.error(`创建活动失败, 错误：${error.code}`)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const rangeTimeValue = fieldsValue['rangeTimePicker']
      let values = fieldsValue
      if(rangeTimeValue && rangeTimeValue.length === 2) {
        values = {
          ...fieldsValue,
          'rangeTimePicker': [
            rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
            rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
          ],
        }
      }
      console.log("handleSubmit values:", values)
      this.props.publishPromotion({
        title: values.title,
        start: values.rangeTimePicker[0],
        end: values.rangeTimePicker[1],
        description: values.description,
        categoryId: this.props.category.id,
        region: values.region,
        awards: values.awards,
        success: () => {
          this.props.history.push('/promotion_list')
        },
        error: this.onSubmitError
      })
    })
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldsValue } = this.props.form
    const {category} = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
    };
    if(category) {
      //TODO 根据用户地理位置设置活动区域默认位置
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="活动名称">
            {getFieldDecorator("title", {
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
            {getFieldDecorator("region", {
              rules: [{ type: 'array', required: true, message: '请输入活动生效区域' }],
              initialValue: ['430000', '430100'],
            })(
              <DivisionCascader level={2}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="红包参数">
            {getFieldDecorator("awards", {
              rules: [{ type: 'object', required: true, message: '请输入红包活动参数' }],
            })(
              <RedEnvelopeParamsInput />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="活动说明">
            {getFieldDecorator("description", {
              rules: [{}],
            })(
              <TextArea placeholder="描述活动" />
            )}
          </FormItem>
          <FormItem wrapperCol={{offset: 15}}>
            <Button type="primary" htmlType="submit"
                    disabled={hasErrors(getFieldsError())}>
              发布
            </Button>
          </FormItem>
        </Form>
      )
    } else {
      return (
        <div>
          <Alert showIcon type="warning" message="未知的活动类型" description="请联系客服，确认后台已经创建该营销活动类型！"/>
        </div>
      )
    }
  }
}

const RedEnvelopeCreateForm = Form.create() (CreateForm)

const mapStateToProps = (appState, ownProps) => {
  return {
    category: selector.selectCategoryByTitle(appState, '随机红包')
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default connect(mapStateToProps, mapDispatchToProps)(RedEnvelopeCreateForm)
