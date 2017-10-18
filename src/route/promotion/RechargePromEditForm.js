/**
 * Created by wanpeng on 2017/10/17.
 */
import React, {Component, PureComponent} from 'react'
import {connect} from 'react-redux'
import {
  Button,
  Input,
  Form,
  message,
  DatePicker,
} from 'antd'
import {actions}  from './redux'
import moment from 'moment'
import DivisionCascader from '../../component/DivisionCascader'
import AwardsInput from './AwardsInput'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const TextArea = Input.TextArea

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

function hasChanges(initialValues, fieldsValue) {
  return Object.keys(fieldsValue).some(field => fieldsValue[field] != initialValues[field])
}

class EditForm extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const rangeTimeValue = fieldsValue['rangeTimePicker']
      let values = fieldsValue
      if(rangeTimeValue) {
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
        title: values.title,
        start: values.rangeTimePicker? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker? values.rangeTimePicker[1] : undefined,
        description: values.description,
        region: values.region,
        awards: {rechargeList: values.awards},
        status: values.status,
        success: () => {
          message.success("修改成功")
          this.props.onSubmit()
        },
        error: (error) => {
          message.error("活动修改失败")
        }
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
        <FormItem hasFeedback {...formItemLayout} label="活动起始时间">
          {getFieldDecorator("rangeTimePicker", {
            rules: [{ required: true}],
            initialValue: [moment(promotion.start, dateFormat), moment(promotion.end, dateFormat)],
          })(
            <RangePicker showTime format={dateFormat}/>
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="活动区域">
          {getFieldDecorator("region", {
            rules: [{ type: 'array', required: true, message: '请输入活动生效区域' }],
            initialValue: promotion.region,
          })(
            <DivisionCascader />
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="奖励金额">
          {getFieldDecorator("awards", {
            rules: [{ type: 'array', required: true, message: '请输入奖励金额', min: 1, max: 5}],
            initialValue: promotion.awards.rechargeList
          })(
            <AwardsInput />
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
          <Button type="primary" htmlType="submit"
                  disabled={!hasChanges(promotion, getFieldsValue()) || hasErrors(getFieldsError())}>
            提交
          </Button>
        </FormItem>

      </Form>
    )
  }
}

const RechargePromEditForm = Form.create()(EditForm)

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default connect(mapStateToProps, mapDispatchToProps)(RechargePromEditForm)

