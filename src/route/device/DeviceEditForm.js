/**
 * Created by wanpeng on 2017/9/25.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
  Button,
  Input,
  Form,
  Radio,
  message,
} from 'antd'
import {deviceStatus, actions} from './redux'
import StationSelect from '../station/StationSelect'
import {selector as authSelector} from '../../util/auth/'
import {PERMISSION_CODE} from '../../util/rolePermission/'
import * as errno from '../../errno'

const FormItem = Form.Item
const RadioGroup = Radio.Group

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

function hasChanges(initialValues, fieldsValue) {
  return Object.keys(fieldsValue).some(field => fieldsValue[field] != initialValues[field])
}

class EditForm extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      division: undefined
    }
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.props.modifyDeviceAction({
        deviceNo: values.deviceNo,
        stationId: values.stationId,
        deviceAddr: values.deviceAddr,
        status: values.status,
        success: () => {
          message.success("修改成功")
          this.props.onSubmit()
        },
        error: (error) => {
          switch (error.code) {
            case errno.EPERM:
              message.error("用户未登录")
              break
            case errno.EINVAL:
              message.error("参数错误")
              break
            case errno.ERROR_NO_STATION:
              message.error("无服务点信息")
              break
            default:
              message.error("修改失败:" + errno.code)
              break
          }
        }
      })
    })
  }

  render() {
    const {editStationAddrPer, changeDeviceStatusPer, changeStationPer} = this.props
    const { getFieldDecorator, getFieldsError, getFieldsValue } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="编号">
          {getFieldDecorator("deviceNo", {
            rules: [{ required: true}],
            initialValue: this.props.device.deviceNo,
          })(
            <Input disabled={true} />
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="服务点">
          {getFieldDecorator("stationId", {
            rules: [{ required: true, message: '请指定服务网点！' }],
            initialValue: this.props.device.stationId,
          })(
            <StationSelect disabled={!changeStationPer} />
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="干衣柜位置">
          {getFieldDecorator("deviceAddr", {
            rules: [{ required: true, message: '请输入干衣柜位置!' }],
            initialValue: this.props.device.deviceAddr,
          })(
            <Input disabled={!editStationAddrPer}/>
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="状态">
          {getFieldDecorator("status", {
            rules: [{ required: true, message: '请选择干衣柜状态！' }],
            initialValue: this.props.device.status,
          })(
            <RadioGroup disabled={!changeDeviceStatusPer}>
              <Radio value={deviceStatus.DEVICE_STATUS_IDLE}>空闲</Radio>
              <Radio disabled={true} value={deviceStatus.DEVICE_STATUS_OCCUPIED}>使用中</Radio>
              <Radio value={deviceStatus.DEVICE_STATUS_OFFLINE}>下线</Radio>
              <Radio value={deviceStatus.DEVICE_STATUS_FAULT}>故障</Radio>
              <Radio value={deviceStatus.DEVICE_STATUS_MAINTAIN}>维修保养</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem wrapperCol={{offset: 20}}>
          <Button type="primary" htmlType="submit"
                  disabled={!hasChanges(this.props.device, getFieldsValue()) || hasErrors(getFieldsError())}>
            提交
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const DeviceEditForm = Form.create()(EditForm)

const mapStateToProps = (appState, ownProps) => {
  const editStationAddrPer = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.DEVICE_EDIT_STATION_ADDR])
  const changeDeviceStatusPer = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.DEVICE_CHANGE_STATUS])
  const changeStationPer = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.DEVICE_CHANGE_STATION])
  return {
    editStationAddrPer,
    changeDeviceStatusPer,
    changeStationPer,
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceEditForm)
