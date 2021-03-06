/**
 * Created by wanpeng on 2017/10/11.
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
  Popconfirm,
} from 'antd'
import style from './promotion.module.scss'
import DivisionCascader from '../../component/DivisionCascader'
import AwardsInput from './AwardsInput'
import {actions, selector, PromotionCategoryType} from './redux'
import * as errno from '../../errno'


const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const TextArea = Input.TextArea


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class PromotionCreateForm extends PureComponent {
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
      let awardsError = false
      if(values.awards.length < 1) {
        message.error("奖励金额参数有误")
        return
      }
      values.awards.forEach((value) => {
        if(value.recharge <= 0 || value.award <= 0) {
          awardsError = true
        }
      })
      if(awardsError) {
        message.error("奖励金额参数有误")
        return
      }
      this.props.publishPromotion({
        title: values.title,
        start: values.rangeTimePicker[0],
        end: values.rangeTimePicker[1],
        description: values.description,
        categoryId: this.props.category.id,
        region: values.region,
        awards: {rechargeList: values.awards},
        success: () => {
          this.props.history.push('/promotion_list')
        },
        error: this.onSubmitError
      })
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
        sm: { span: 13 },
      },
    };
    if(this.props.category) {
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
          <FormItem {...formItemLayout} label="奖励金额">
            {getFieldDecorator("awards", {
              rules: [{ type: 'array', required: true, message: '请输入奖励金额', min: 1, max: 5}],
            })(
              <AwardsInput />
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
            <Popconfirm placement="top" title="确认发布吗？" onConfirm={this.handleSubmit} okText="是的" cancelText="再想想">
              <Button type="primary"
                      disabled={hasErrors(getFieldsError())}>
                发布
              </Button>
            </Popconfirm>
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

const RechargePromotionCreateForm = Form.create()(PromotionCreateForm)

const mapStateToProps = (appState, ownProps) => {
  return {
    category: selector.selectCategoryByType(appState, PromotionCategoryType.PROMOTION_CATEGORY_TYPE_RECHARGE)
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default connect(mapStateToProps, mapDispatchToProps)(RechargePromotionCreateForm)
