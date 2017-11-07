/**
 * Created by wanpeng on 2017/9/26.
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
import {stationSelector, stationAction} from '../station/redux'
import {OrderStatus, actions} from './redux'
import * as errno from '../../errno'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option


class SearchForm extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {requestStations, fetchOrdersAction} = this.props
    requestStations({})
    fetchOrdersAction({
      limit: 10,
      isRefresh: true,
      success: (total) => this.onFetchOrdersSuccess(total, {}),
      error: this.onFetchOrdersError,
    })
  }

  onFetchOrdersSuccess(total, values) {
    const {updateSearchParams, onSearchEnd} = this.props
    if (updateSearchParams) {
      updateSearchParams({
        start: values.rangeTimePicker ? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker ? values.rangeTimePicker[1] : undefined,
        status: !values.status || values.status == 'all' ? undefined : Number(values.status),
        mobilePhoneNumber: values.phone || undefined,
        stationId: values.stationId == 'all' ? undefined : values.stationId,
      }, total)
    }
    if(onSearchEnd) {
      onSearchEnd()
    }
  }

  onFetchOrdersError = (error) => {
    const {onSearchEnd} = this.props
    if(onSearchEnd) {
      onSearchEnd()
    }
    switch (error.code)
    {
      case errno.EPERM:
        message.error("用户未登录")
        break
      default:
        message.error(`查询订单信息失败, 错误：${error.code}`)
        break
    }
  }

  handleSubmit = (e) => {
    const {form, fetchOrdersAction, onSearchStart} = this.props
    e.preventDefault()
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const rangeTimeValue = fieldsValue['rangeTimePicker']
      let values = fieldsValue
      if (rangeTimeValue && rangeTimeValue.length === 2) {
        values = {
          ...fieldsValue,
          'rangeTimePicker': [
            rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
            rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
          ],
        }
      }
      fetchOrdersAction({
        start: values.rangeTimePicker ? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker ? values.rangeTimePicker[1] : undefined,
        status: !values.status || values.status == 'all' ? undefined : Number(values.status),
        mobilePhoneNumber: values.phone,
        stationId: values.stationId == 'all' ? undefined : values.stationId,
        limit: 10,
        isRefresh: true,
        success: (total) => this.onFetchOrdersSuccess(total, values),
        error: this.onFetchOrdersError,
      })
      if(onSearchStart) {
        onSearchStart()
      }
    })
  }

  render() {
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form
    const areaCodeSelector = getFieldDecorator('areaCode', {
      initialValue: '86',
    })(
      <Select style={{width: 60}}>
        <Option value="86">+86</Option>
      </Select>
    );
    return (
      <Form className={style.search} layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator("rangeTimePicker", {
            rules: [{type: 'array'}],
          })(
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("stationId", {})(
            <Select style={{width: 200}} placeholder="选择服务网点">
              <Option value="all">全部</Option>
              {
                this.props.stationList.map((station, index) => (
                  <Option key={index} value={station.id}>{station.name}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("phone", {})(
            <Input addonBefore={areaCodeSelector} placeholder="手机号码" style={{width: '100%'}}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("status", {})(
            <Select style={{width: 120}} placeholder="选择状态">
              <Option value="all">全部</Option>
              <Option value={OrderStatus.ORDER_STATUS_UNPAID.toString()}>未支付</Option>
              <Option value={OrderStatus.ORDER_STATUS_OCCUPIED.toString()}>使用中</Option>
              <Option value={OrderStatus.ORDER_STATUS_PAID.toString()}>已支付</Option>
            </Select>
          )}
        </FormItem>
        <FormItem>
          <Button.Group>
            <Button onClick={() => {
              this.props.form.resetFields()
            }}>重置</Button>
            <Button type="primary" htmlType="submit">查询</Button>
          </Button.Group> </FormItem>
      </Form>
    )
  }
}

const OrderSearchForm = Form.create()(SearchForm)

const mapStateToProps = (appState, ownProps) => {
  let stationList = stationSelector.selectStations(appState)
  return {
    stationList: stationList,
  }
}

const mapDispatchToProps = {
  ...actions,
  ...stationAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSearchForm)
