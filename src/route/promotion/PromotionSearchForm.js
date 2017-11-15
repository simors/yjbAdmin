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
import {actions} from './redux'
import style from './promotion.module.scss'
import DivisionCascader from '../../component/DivisionCascader'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

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
      this.props.fetchPromotionsAction({
        start: values.rangeTimePicker? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker? values.rangeTimePicker[1] : undefined,
        region: values.region,
        showType: values.showType,
      })
    })
  }


  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

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
          {getFieldDecorator("region", {
            rules: [{ type: 'array' }],
          })(
            <DivisionCascader level={2}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("showType", {})(
            <Select style={{width: 120}} placeholder="选择活动状态">
              <Option value="">全部</Option>
              <Option value='disable'>禁用</Option>
              <Option value='enable'>进行中</Option>
              <Option value='isBefore'>已结束</Option>
              <Option value='isAfter'>待触发</Option>
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

const PromotionSearchForm = Form.create()(SearchForm)

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionSearchForm)
