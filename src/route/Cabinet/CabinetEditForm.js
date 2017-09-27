/**
 * Created by wanpeng on 2017/9/25.
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
  Radio,
  message,
} from 'antd'
import style from './cabinet.module.scss'
import {cabinetStatus, modifyCabinetAction} from './redux'
import StationSelect from '../station/StationSelect'

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
      this.props.modifyCabinetAction({
        deviceNo: values.deviceNo,
        stationId: values.stationId,
        deviceAddr: values.deviceAddr,
        status: values.status,
        success: () => {
          message.success("修改成功")
          this.props.onSubmit()
        },
        error: (error) => {
          message.error("修改失败")
          console.log(error)
        }
      })
    })
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldsValue } = this.props.form
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
            initialValue: this.props.cabinet.deviceNo,
          })(
            <Input disabled={true} />
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="服务点">
          {getFieldDecorator("stationId", {
            rules: [{ required: true, message: '请指定服务网点！' }],
            initialValue: this.props.cabinet.stationId,
          })(
            <StationSelect />
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="干衣柜位置">
          {getFieldDecorator("deviceAddr", {
            rules: [{ required: true, message: '请输入干衣柜位置!' }],
            initialValue: this.props.cabinet.deviceAddr,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="状态">
          {getFieldDecorator("status", {
            rules: [{ required: true, message: '请选择干衣柜状态！' }],
            initialValue: this.props.cabinet.status,
          })(
            <RadioGroup>
              <Radio disabled={true} value={cabinetStatus.DEVICE_STATUS_IDLE}>空闲</Radio>
              <Radio value={cabinetStatus.DEVICE_STATUS_OCCUPIED}>使用中</Radio>
              <Radio disabled={true} value={cabinetStatus.DEVICE_STATUS_OFFLINE}>下线</Radio>
              <Radio value={cabinetStatus.DEVICE_STATUS_FAULT}>故障</Radio>
              <Radio value={cabinetStatus.DEVICE_STATUS_MAINTAIN}>维修保养</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem wrapperCol={{offset: 20}}>
          <Button type="primary" htmlType="submit"
                  disabled={!hasChanges(this.props.cabinet, getFieldsValue()) || hasErrors(getFieldsError())}>
            提交
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const CabinetEditForm = Form.create()(EditForm)

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  modifyCabinetAction
}

export default connect(mapStateToProps, mapDispatchToProps)(CabinetEditForm)
