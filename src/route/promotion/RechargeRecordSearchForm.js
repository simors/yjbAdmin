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
} from 'antd'
import {actions, PromotionCategoryType} from './redux'
import style from './promotion.module.scss'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

class SearchForm extends PureComponent {
  constructor(props) {
    super(props)
  }

  handleSubmit = (e) => {
    const {promotion} = this.props
    console.log("promotion", promotion)
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
        type: PromotionCategoryType.PROMOTION_CATEGORY_TYPE_RECHARGE,
        promotionId: promotion.id,
        isRefresh: true,
        limit: 10,
        mobilePhoneNumber: values.phone,
        start: values.rangeTimePicker? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker? values.rangeTimePicker[1] : undefined,
      })
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
          <Button type="primary" htmlType="submit">查询</Button>
        </FormItem>
      </Form>
    )
  }
}

const RechargeRecordSearchForm = Form.create()(SearchForm)

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default connect(mapStateToProps, mapDispatchToProps)(RechargeRecordSearchForm)
