/**
 * Created by wanpeng on 2017/9/22.
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
} from 'antd'
import style from './device.module.scss'
import {deviceStatus, actions} from './redux'
import {stationSelector, stationAction} from '../station/redux'

const FormItem = Form.Item
const Option = Select.Option

class SearchForm extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.requestStations({})
  }

  handleSubmit = (e) => {
  e.preventDefault()
  this.props.form.validateFields((err, values) => {
    if (err) {
      return
    }
    this.props.fetchDevicesAction({
      deviceNo: values.deviceNo || undefined,
      stationId: values.stationId == 'all'? undefined : values.stationId,
      status: !values.status || values.status == 'all'? undefined : Number(values.status),
      limit: 10,
      isRefresh: true,
    })
  })
}

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
    return (
      <Form className={style.search} layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator("deviceNo", {})(
            <Input placeholder="干衣柜编号"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("stationId", {})(
            <Select style={{width: 120}} placeholder="选择服务网点">
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
          {getFieldDecorator("status", {})(
            <Select style={{width: 120}} placeholder="选择状态">
              <Option value="all">全部</Option>
              <Option value={deviceStatus.DEVICE_STATUS_IDLE.toString()}>空闲</Option>
              <Option value={deviceStatus.DEVICE_STATUS_OCCUPIED.toString()}>使用中</Option>
              <Option value={deviceStatus.DEVICE_STATUS_OFFLINE.toString()}>下线</Option>
              <Option value={deviceStatus.DEVICE_STATUS_FAULT.toString()}>故障</Option>
              <Option value={deviceStatus.DEVICE_STATUS_MAINTAIN.toString()}>维修保养</Option>
              <Option value={deviceStatus.DEVICE_STATUS_UNREGISTER.toString()}>未注册</Option>
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

const DeviceSearchForm = Form.create()(SearchForm)

const mapStateToProps = (appState, ownProps) => {
  let stationList = stationSelector.selectStations(appState)
  return {
    stationList: stationList,
  }
}

const mapDispatchToProps = {
  ...actions,
  requestStations: stationAction.requestStations,
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSearchForm)
