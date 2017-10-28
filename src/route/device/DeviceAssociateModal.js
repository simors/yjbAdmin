/**
 * Created by wanpeng on 2017/9/23.
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
  Modal,
  Radio,
  message,
} from 'antd'
import style from './device.module.scss'
import DivisionCascader from '../../component/DivisionCascader'
import {stationSelector, stationAction} from '../station/redux'
import {actions} from './redux'

const Option = Select.Option

class DeviceAssociateModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      division: undefined,
      selectedStaionId: undefined,
    }
  }

  componentWillMount() {
    this.props.requestStations({})
  }

  onDivisionChange = (value, selectedOptions) => {
    this.setState({
      division: value,
    })
  }

  inDivision(station) {
    let provinceCode =station.province? station.province.value: undefined
    let cityCode =station.city? station.city.value: undefined
    let areaCode =station.area? station.area.value: undefined
    if(this.state.division == undefined) {
      return true
    }
    if(this.state.division[0] && provinceCode && this.state.division[0] != provinceCode) {
      return false
    }
    if(this.state.division[1] && cityCode && this.state.division[1] != cityCode) {
      return false
    }
    if(this.state.division[2] && areaCode && this.state.division[2] != areaCode) {
      return false
    }
    return true
  }

  onStationChange = (value) => {
    this.setState({
      selectedStaionId: value
    })
  }

  onSubmit = (e) => {
    const {selectedStaionId} = this.state
    const {device, associateWithStationAction, onCancel} = this.props
    if(!selectedStaionId) {
      message.error("请设置服务网点")
      return
    }
    associateWithStationAction({
      stationId: selectedStaionId,
      deviceNo: device.deviceNo,
      success: () => {
        message.success("服务点关联成功")
        onCancel()
      },
      error: (error) => {
        message.error("服务点关联失败")
        console.log(error)
      },
    })
  }

  render() {
    if(this.props.device) {
      return (
        <Modal title="关联服务网点"
               width={720}
               visible={this.props.visible}
               onOk={this.onSubmit}
               onCancel={this.props.onCancel}>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>编号</Col>
            <Col span={6}>
              <Input disabled={true} value={this.props.device.deviceNo} />
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>服务点</Col>
            <Col span={8}>
              <DivisionCascader disabled={false}
                                onChange={this.onDivisionChange} />
            </Col>
            <Col span={6}>
              <Select style={{width: 120}} placeholder="选择服务网点" onChange={this.onStationChange}>
                {
                  this.props.stationList.map((station, index) => {
                    if(this.inDivision(station)) {
                      return <Option key={index} value={station.id}>{station.name}</Option>
                    }
                  })
                }
              </Select>
            </Col>
          </Row>
        </Modal>
      )
    } else {
      return null
    }
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(DeviceAssociateModal)
