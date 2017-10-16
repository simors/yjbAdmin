/**
 * Created by wanpeng on 2017/9/22.
 */
import React from 'react'
import {connect} from 'react-redux'
import {deviceStatus} from './redux'
import {
  Row,
  Col,
  Input,
  Select,
  Modal,
  Radio,
} from 'antd'
import QRCode from 'qrcode.react'
import style from './device.module.scss'
import DivisionCascader from '../../component/DivisionCascader'
import {stationSelector} from '../station/redux'

const RadioGroup = Radio.Group
const Option = Select.Option


class DeviceDetailModal extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  downloadQRCode = () => {
    let canvas = this.refs.qrcode._canvas
    const a = document.getElementById('download')
    let url = canvas.toDataURL()
    a.setAttribute('href', url)
  }

  render() {
    if(this.props.device && this.props.station) {
      return (
        <Modal title="干衣柜详情"
               width={720}
               visible={this.props.visible}
               onOk={this.props.onOk}
               onCancel={this.props.onCancel}>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>编号</Col>
            <Col span={6}>
              <Input disabled={true} defaultValue={this.props.device.deviceNo} />
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>服务点</Col>
            <Col span={10}>
              <DivisionCascader disabled={true}
                                defaultValue={[this.props.station.province.value, this.props.station.city.value, this.props.station.area.value]} />
            </Col>
            <Col span={6}>
              <Select disabled={true} value={this.props.station.id} style={{width: 120}}>
                <Option value={this.props.station.id}>{this.props.station.name}</Option>
              </Select>
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}></Col>
            <Col span={10}>
              <span>{"服务网点地址：" + this.props.station.addr}</span>
            </Col>
            <Col>
              <span>{"管理员：" + this.props.station.adminName + "  " + this.props.station.adminPhone}</span>
            </Col>
          </Row>

          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>干衣柜位置</Col>
            <Col span={12}>
              <Input disabled={true} defaultValue={this.props.device.deviceAddr} />
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>状态</Col>
            <Col span={18}>
              <RadioGroup value={this.props.device.status}>
                <Radio value={deviceStatus.DEVICE_STATUS_IDLE}>空闲</Radio>
                <Radio value={deviceStatus.DEVICE_STATUS_OCCUPIED}>使用中</Radio>
                <Radio value={deviceStatus.DEVICE_STATUS_OFFLINE}>下线</Radio>
                <Radio value={deviceStatus.DEVICE_STATUS_FAULT}>故障</Radio>
                <Radio value={deviceStatus.DEVICE_STATUS_MAINTAIN}>维修保养</Radio>
                <Radio value={deviceStatus.DEVICE_STATUS_UNREGISTER}>未注册</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} >
            <Col span={4}>二维码</Col>
            <Col span={6}>
              <QRCode ref="qrcode" value={"http://dev.yiijiabao.com/openDevice?deviceNo=" + this.props.device.deviceNo} />
            </Col>
            <Col>
              <a href="" id="download" download={this.props.device.deviceNo} onClick={this.downloadQRCode}>下载二维码</a>
            </Col>
            <div classID=""></div>
          </Row>
        </Modal>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (appState, ownProps) => {
  let device = ownProps.device
  let station = device && device.stationId? stationSelector.selectStationById(appState, device.stationId) : undefined
  return {
    station: station
  }
}

export default connect(mapStateToProps)(DeviceDetailModal)
