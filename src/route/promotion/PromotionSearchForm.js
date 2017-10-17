/**
 * Created by wanpeng on 2017/10/10.
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
import {actions, PromotionStatus} from './redux'
import style from './promotion.module.scss'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

class SearchForm extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchPromotionsAction({})
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
      this.props.fetchPromotionsAction({
        start: values.rangeTimePicker? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker? values.rangeTimePicker[1] : undefined,
        status: !values.status || values.status == 'all'? undefined : Number(values.status),
      })
    })
  }


  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

    return (
      <Form className={style.search} layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator("rangeTimePicker", {
            rules: [{ type: 'array', message: '请输入起始时间!' }],
          })(
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("status", {})(
            <Select style={{width: 120}} placeholder="选择活动状态">
              <Option value="all">全部</Option>
              <Option value={PromotionStatus.PROMOTION_STATUS_AWAIT.toString()}>待触发</Option>
              <Option value={PromotionStatus.PROMOTION_STATUS_UNDERWAY.toString()}>进行中</Option>
              <Option value={PromotionStatus.PROMOTION_STATUS_INVALID.toString()}>无效</Option>
            </Select>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">查询</Button>
        </FormItem>
      </Form>
    )
  }
}

const PromotionSearchForm = Form.create()(SearchForm)

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionSearchForm)
