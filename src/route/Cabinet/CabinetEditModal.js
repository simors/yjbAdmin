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
} from 'antd'
import style from './cabinet.module.scss'
import DivisionCascader from '../../component/DivisionCascader'
import {stationSelector, stationAction} from '../station/redux'


class CabinetEditModal extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.requestStations({})
  }

  onDivisionChange = (value, selectedOptions) => {

  }

  render() {
    if(this.props.cabinet) {
      return (
        <Modal title="关联服务网点"
               width={720}
               visible={this.props.visible}
               onOk={this.props.onOk}
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
              <Select style={{width: 120}} placeholder="选择服务网点">
                {
                  this.props.stationList.map((station, index) => (
                    <Option key={index} value={station.id}>{station.name}</Option>
                  ))
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
}

export default connect(mapStateToProps, mapDispatchToProps)(CabinetEditModal)
