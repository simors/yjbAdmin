/**
 * Created by wanpeng on 2017/10/23.
 */
import React, {Component, PureComponent} from 'react'
import {connect} from 'react-redux'
import {
  Button,
  Input,
  Form,
  message,
  DatePicker,
  Switch,
  Popconfirm,
} from 'antd'
import {actions}  from './redux'
import moment from 'moment'
import DivisionCascader from '../../component/DivisionCascader'
import RedEnvelopeParamsInput from './RedEnvelopeParamsInput'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const TextArea = Input.TextArea

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

function hasChanges(initialValues, fieldsValue) {
  return Object.keys(fieldsValue).some(field => fieldsValue[field] != initialValues[field])
}

class EditForm extends  Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  onSubmitError = (error) => {
    switch (error.code) {
      case errno.EPERM:
        message.error("用户未登录")
        break
      case error.EINVAL:
        message.error("参数错误")
        break
      case  error.ENODATA:
        message.error("没找到该活动对象")
        break
      default:
        message.error(`创建活动失败, 错误：${error.code}`)
    }
  }

  handleSubmit = (e) => {
    const {promotion} = this.props
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
      this.props.editPromotion({
        promotionId: promotion.id,
        title: values.title,
        start: values.rangeTimePicker? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker? values.rangeTimePicker[1] : undefined,
        description: values.description,
        region: values.region,
        awards: values.awards,
        disabled: !values.disabled,
        success: () => {
          message.success("修改成功")
          this.props.onSubmit()
        },
        error: this.onSubmitError
      })
    })
  }

  render() {
    const { promotion } = this.props
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldsValue } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }
    const dateFormat = 'YYYY-MM-DD HH:mm:ss'
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem hasFeedback {...formItemLayout} label="活动名称">
          {getFieldDecorator("title", {
            rules: [{ required: true}],
            initialValue: promotion.title,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="活动开关">
          {getFieldDecorator("disabled", {
            rules: [{ required: true}],
            valuePropName: 'checked',
            initialValue: !promotion.disabled,
          })(
            <Switch />
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="活动起始时间">
          {getFieldDecorator("rangeTimePicker", {
            rules: [{ required: true}],
            initialValue: [moment(new Date(promotion.start), dateFormat), moment(new Date(promotion.end), dateFormat)],
          })(
            <RangePicker disabled showTime format="LLLL"/>
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="活动区域">
          {getFieldDecorator("region", {
            rules: [{ type: 'array', required: true, message: '请输入活动生效区域' }],
            initialValue: promotion.region,
          })(
            <DivisionCascader disabled={true} />
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="红包参数">
          {getFieldDecorator("awards", {
            rules: [{ type: 'object', required: true, message: '请输入红包活动参数'}],
            initialValue: promotion.awards
          })(
            <RedEnvelopeParamsInput disabled={true} />
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="活动说明">
          {getFieldDecorator("description", {
            rules: [{}],
            initialValue: promotion.description,
          })(
            <TextArea placeholder="描述活动" />
          )}
        </FormItem>
        <FormItem hasFeedback wrapperCol={{offset: 20}}>
          <Popconfirm placement="top" title="确认提交修改吗？" onConfirm={this.handleSubmit} okText="是的" cancelText="再想想">
            <Button type="primary"
                    disabled={!hasChanges(promotion, getFieldsValue()) || hasErrors(getFieldsError())}>
              提交
            </Button>
          </Popconfirm>
        </FormItem>

      </Form>
    )
  }
}

const RedEnvelopePromEditForm = Form.create()(EditForm)

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default connect(mapStateToProps, mapDispatchToProps)(RedEnvelopePromEditForm)
