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
import {selector as userSelector} from '../../util/auth'
import * as appConfig from '../../util/appConfig'

const RadioGroup = Radio.Group
const Option = Select.Option


class DeviceDetailModal extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  downloadQRCode = () => {
    const {device} = this.props
    const a = document.getElementById('download')
    if(device.qrcode) {
      a.setAttribute('href', device.qrcode)
    } else {
      let canvas = this.refs.qrcode._canvas
      let url = canvas.toDataURL()
      a.setAttribute('href', url)
    }
  }

  renderQRcode(device) {
    if(device.qrcode) {
      return(<img ref="qrcode" src={device.qrcode} alt=""/>)
    } else {
      return(<QRCode ref="qrcode" value={appConfig.MP_CLIENT_DOMAIN + '/openDevice/' + device.deviceNo} />)
    }
  }

  render() {
    const {device, station, stationUser} = this.props
    if(device) {
      return (
        <Modal title="干衣柜详情"
               width={720}
               visible={true}
               onOk={this.props.onOk}
               onCancel={this.props.onCancel}>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>编号</Col>
            <Col span={6}>
              <Input disabled={true} value={device.deviceNo} />
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>服务点</Col>
            <Col span={10}>
              {
                station ? <DivisionCascader disabled={true} showType='search'
                                            value={[station.province.value, station.city.value, station.area.value]} />
                  : <DivisionCascader disabled={true}/>
              }
            </Col>
            <Col span={6}>
              {
                station ? (
                  <Select disabled={true} value={station.id} style={{width: 120}}>
                    <Option value={station.id}>{station.name}</Option>
                  </Select>
                ) : (
                  <Select disabled={true} defaultValue="0" style={{width: 120}}>
                    <Option value="0">未指定</Option>
                  </Select>
                )
              }
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}></Col>
            <Col span={10}>
              {
                station ? <span>{"服务网点地址：" + station.addr}</span>
                  : <span>服务网点地址：未指定</span>
              }
            </Col>
            <Col>
              {
                stationUser ? <span>{"管理员：" + stationUser.nickname + "  " + stationUser.mobilePhoneNumber}</span>
                  : <span>管理员：未指定</span>
              }
            </Col>
          </Row>

          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>干衣柜位置</Col>
            <Col span={12}>
              <Input disabled={true} value={device.deviceAddr} />
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>状态</Col>
            <Col span={18}>
              <RadioGroup value={device.status}>
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
            <Col span={8}>
              {this.renderQRcode(device)}
            </Col>
            <Col>
              <a href="" id="download" download={device.deviceNo} onClick={this.downloadQRCode}>下载二维码</a>
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
  let station = device? stationSelector.selectStationById(appState, device.stationId) : undefined
  let stationUser = station? userSelector.selectUserById(appState, station.adminId) : undefined
  return {
    station: station,
    stationUser: stationUser,
  }
}

export default connect(mapStateToProps)(DeviceDetailModal)
