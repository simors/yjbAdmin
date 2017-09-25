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
import style from './cabinet.module.scss'
import DivisionCascader from '../../component/DivisionCascader'
import {stationSelector, stationAction} from '../station/redux'
import {associateWithStationAction} from './redux'

const Option = Select.Option

class CabinetAssociateModal extends PureComponent {
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
    let provinceCode = station.province.value
    let cityCode = station.city.value
    let areaCode = station.area.value
    if(this.state.division == undefined) {
      return true
    }
    if(this.state.division[0] && this.state.division[0] != provinceCode) {
      return false
    }
    if(this.state.division[1] && this.state.division[1] != cityCode) {
      return false
    }
    if(this.state.division[2] && this.state.division[2] != areaCode) {
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
    this.props.associateWithStationAction({
      stationId: this.state.selectedStaionId,
      deviceNo: this.props.cabinet.deviceNo,
      success: () => {
        message.success("服务点关联成功")
        this.props.onCancel()
      },
      error: (error) => {
        message.error("服务点关联失败")
        console.log(error)
      },
    })
  }

  render() {
    if(this.props.cabinet) {
      return (
        <Modal title="关联服务网点"
               width={720}
               visible={this.props.visible}
               onOk={this.onSubmit}
               onCancel={this.props.onCancel}>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>编号</Col>
            <Col span={6}>
              <Input disabled={true} defaultValue={this.props.cabinet.deviceNo} />
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
  requestStations: stationAction.requestStations,
  associateWithStationAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(CabinetAssociateModal)
