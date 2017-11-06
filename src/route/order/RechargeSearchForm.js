/**
 * Created by wanpeng on 2017/10/4.
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
import style from './order.module.scss'
import {actions, DealType} from './redux'
import * as errno from '../../errno'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

class SearchForm extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {fetchDealAction} = this.props
    fetchDealAction({
      dealType: DealType.DEAL_TYPE_RECHARGE,
      limit: 10,
      isRefresh: true,
      success: (total) => this.onFetchRechargeSuccess(total, {}),
      error: this.onFetchRechargeError,
    })
  }

  onFetchRechargeSuccess(total, values) {
    const {updateSearchParams, onSearchEnd} = this.props
    if (updateSearchParams) {
      updateSearchParams({
        start: values.rangeTimePicker? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker? values.rangeTimePicker[1] : undefined,
        mobilePhoneNumber: values.phone || undefined,
      }, total)
    }
    if(onSearchEnd) {
      onSearchEnd()
    }
  }

  onFetchRechargeError = (error) => {
    const {onSearchEnd} = this.props
    if(onSearchEnd) {
      onSearchEnd()
    }
    switch (error.code)
    {
      case errno.EPERM:
        message.error("用户未登录")
        break
      case errno.ERROR_NO_USER:
        message.error("用户不存在")
        break
      default:
        message.error(`查询充值订单记录, 错误：${error.code}`)
        break
    }
  }

  handleSubmit = (e) => {
    const {onSearchStart, fetchDealAction} = this.props
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
      fetchDealAction({
        dealType: DealType.DEAL_TYPE_RECHARGE,
        start: values.rangeTimePicker? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker? values.rangeTimePicker[1] : undefined,
        mobilePhoneNumber: values.phone || undefined,
        limit: 10,
        isRefresh: true,
        success: (total) => this.onFetchRechargeSuccess(total, values),
        error: this.onFetchRechargeError,
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

const RechargeSearchForm = Form.create()(SearchForm)

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default connect(mapStateToProps, mapDispatchToProps)(RechargeSearchForm)
