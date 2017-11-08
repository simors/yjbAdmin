/**
 * Created by wanpeng on 2017/10/21.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
  Button,
  Table,
  Row,
  Col,
  Input,
  Form,
  Select,
  DatePicker,
  message,
} from 'antd'
import {actions, PromotionCategoryType, selector} from './redux'
import style from './promotion.module.scss'
import * as errno from '../../errno'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

class SearchForm extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {promotion, category} = this.props
    this.props.fetchPromotionRecordAction({
      promotionId: promotion.id,
      type: category.type,
      isRefresh: true,
      limit: 10,
      success: (total) => this.onFetchRecordsSuccess(total, {}),
      error: this.onFetchRecordsError,
    })
  }

  onFetchRecordsSuccess(total, values) {
    const {updateSearchParams, onSearchEnd} = this.props
    if (updateSearchParams) {
      updateSearchParams({
        mobilePhoneNumber: values.phone || undefined,
        start: values.rangeTimePicker? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker? values.rangeTimePicker[1] : undefined,
      }, total)
    }
    if(onSearchEnd) {
      onSearchEnd()
    }
  }

  onFetchRecordsError = (error) => {
    const {onSearchEnd} = this.props
    if(onSearchEnd) {
      onSearchEnd()
    }
    switch (error.code)
    {
      case errno.EPERM:
        message.error("用户未登录")
        break
      case errno.EINVAL:
        message.error("参数错误")
      default:
        message.error(`查询活动记录失败, 错误：${code}`)
        break
    }
  }

  handleSubmit = (e) => {
    const {promotion, onSearchStart, category} = this.props
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
      this.props.fetchPromotionRecordAction({
        promotionId: promotion.id,
        type: category.type,
        isRefresh: true,
        limit: 10,
        mobilePhoneNumber: values.phone,
        start: values.rangeTimePicker? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker? values.rangeTimePicker[1] : undefined,
        success: (total) => this.onFetchRecordsSuccess(total, values),
        error: this.onFetchRecordsError,
      })
      if(onSearchStart) {
        onSearchStart()
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
    const areaCodeSelector = getFieldDecorator('areaCode', {
      initialValue: '86',
    })(
      <Select style={{ width: 60 }}>
        <Option value="86">+86</Option>
      </Select>
    );
    return (
      <Form className={style.search} layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator("rangeTimePicker", {
            rules: [{ type: 'array'}],
          })(
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("phone", {})(
            <Input addonBefore={areaCodeSelector} placeholder="手机号码" style={{ width: '100%' }} />
          )}
        </FormItem>
        <FormItem>
          <Button.Group>
            <Button onClick={() => {this.props.form.resetFields()}}>重置</Button>
            <Button type="primary" htmlType="submit">查询</Button>
          </Button.Group>
        </FormItem>
      </Form>
    )
  }
}

const PromotionRecordSearchForm = Form.create()(SearchForm)

const mapStateToProps = (appState, ownProps) => {
  const categoryId = ownProps.promotion.categoryId
  return {
    category: selector.selectCategory(appState, categoryId)
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionRecordSearchForm)
