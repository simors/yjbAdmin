/**
 * Created by wanpeng on 2017/9/22.
 */
import React from 'react'
import {connect} from 'react-redux'
import {cabinetStatus} from './redux'
import {
  Button,
  Table,
  Row,
  Col,
  Input,
  Form,
  Select,
  Modal,
  Radio,
} from 'antd'
import style from './cabinet.module.scss'

const RadioGroup = Radio.Group

class CabinetDetailModal extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    if(this.props.cabinet) {
      return (
        <Modal title="干衣柜详情"
               width={720}
               visible={this.props.visible}
               onOk={this.props.onOk}
               onCancel={this.props.onCancel}>
          <Row type='flex' gutter={16} align='middle'>
            <Col span={4}>编号</Col>
            <Col span={6}>
              <Input disabled={true} defaultValue={this.props.cabinet.deviceNo} />
            </Col>
          </Row>
          <Row type='flex' gutter={16} align='middle'>
            <Col span={4}>干衣柜位置</Col>
            <Col span={12}>
              <Input disabled={true} defaultValue={this.props.cabinet.deviceAddr} />
            </Col>
          </Row>
          <Row type='flex' gutter={16} align='middle'>
            <Col span={4}>状态</Col>
            <Col span={18}>
              <RadioGroup value={this.props.cabinet.status}>
                <Radio value={cabinetStatus.DEVICE_STATUS_IDLE}>空闲</Radio>
                <Radio value={cabinetStatus.DEVICE_STATUS_OCCUPIED}>使用中</Radio>
                <Radio value={cabinetStatus.DEVICE_STATUS_OFFLINE}>下线</Radio>
                <Radio value={cabinetStatus.DEVICE_STATUS_FAULT}>故障</Radio>
                <Radio value={cabinetStatus.DEVICE_STATUS_MAINTAIN}>维修保养</Radio>
                <Radio value={cabinetStatus.DEVICE_STATUS_UNREGISTER}>未注册</Radio>
              </RadioGroup>
            </Col>
          </Row>
        </Modal>
      )
    } else {
      return null
    }
  }
}

export default CabinetDetailModal
