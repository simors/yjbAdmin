/**
 * Created by yangyang on 2017/11/6.
 */
import React from 'react'
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
import {actions, WITHDRAW_STATUS, WITHDRAW_APPLY_TYPE} from './redux'
import * as errno from '../../errno'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

class WithdrawApplySearchForm extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {fetchWithdrawApply} = this.props
    fetchWithdrawApply({
      status: WITHDRAW_STATUS.APPLYING,
      success: () => this.onWithdrawProcessSuccess({}),
      error: this.onWithdrawProcessError,
    })
  }

  onWithdrawProcessSuccess(values) {
    const {updateSearchParams, onSearchEnd} = this.props
    if (updateSearchParams) {
      updateSearchParams({
        start: values.rangeTimePicker? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker? values.rangeTimePicker[1] : undefined,
        mobilePhoneNumber: values.phone ? values.phone : undefined,
        applyType: values.applyType ? values.applyType : undefined,
        status: values.status ? values.status : WITHDRAW_STATUS.APPLYING,
      })
    }
    if(onSearchEnd) {
      onSearchEnd()
    }
  }

  onWithdrawProcessError = (error) => {
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
    const {onSearchStart, fetchWithdrawApply} = this.props
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
      fetchWithdrawApply({
        start: values.rangeTimePicker? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker? values.rangeTimePicker[1] : undefined,
        mobilePhoneNumber: values.phone,
        applyType: values.applyType ? values.applyType : undefined,
        status: values.status ? values.status : undefined,
        success: () => this.onWithdrawProcessSuccess(values),
        error: this.onWithdrawProcessError,
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
          {getFieldDecorator("applyType", {})(
            <Select style={{width: 120}} placeholder="选择申请类别" allowClear>
              <Option value={WITHDRAW_APPLY_TYPE.PROFIT.toString()}>收益取现</Option>
              <Option value={WITHDRAW_APPLY_TYPE.REFUND.toString()}>押金返还</Option>
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("status", {
            initialValue: WITHDRAW_STATUS.APPLYING.toString()
          })(
            <Select style={{width: 120}} placeholder="选择状态">
              <Option value={WITHDRAW_STATUS.APPLYING.toString()}>等待处理</Option>
              <Option value={WITHDRAW_STATUS.DONE.toString()}>处理完成</Option>
            </Select>
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

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(WithdrawApplySearchForm))
