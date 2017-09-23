/**
 * Created by wanpeng on 2017/9/19.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {fetchCabinetsAction, selectCabinets, cabinetStatus} from './redux'
import {
  Button,
  Table,
  Row,
  Col,
  Input,
  Form,
  Select,
  Icon,
} from 'antd'
import style from './cabinet.module.scss'
import CabinetSearchForm from './CabinetSearchForm'
import CabinetDetailModal from './CabinetDetailModal'
import CabinetEditModal from './CabinetEditModal'

const ButtonGroup = Button.Group

const columns = [
  { title: '编号', dataIndex: 'deviceNo', key: 'deviceNo' },
  { title: '干衣柜位置', dataIndex: 'deviceAddr', key: 'deviceAddr' },
  { title: '服务点', dataIndex: 'stationName', key: 'stationName' },
  { title: '上线日期', dataIndex: 'onlineTime', key: 'onlineTime', render: (onlineTime) => <span>{onlineTime.slice(0, 10)}</span> },
  { title: '状态', dataIndex: 'status', key: 'status', render: (status) => {
    switch (status) {
      case cabinetStatus.DEVICE_STATUS_IDLE:
        return <span>空闲</span>
        break
      case cabinetStatus.DEVICE_STATUS_OCCUPIED:
        return <span>使用中</span>
        break
      case cabinetStatus.DEVICE_STATUS_OFFLINE:
        return <span>下线</span>
        break
      case cabinetStatus.DEVICE_STATUS_FAULT:
        return <span>故障</span>
        break
      case cabinetStatus.DEVICE_STATUS_MAINTAIN:
        return <span>维修保养</span>
        break
      case cabinetStatus.DEVICE_STATUS_UNREGISTER:
        return <span>未注册</span>
        break
      default:
        break
    }
  }}
]

class Cabinet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showCabinetDetailModal: false,
      selectCabinet: undefined,
      showCabinetEditModal: false,
    }
  }

  componentWillMount() {
    this.props.fetchCabinetsAction({
      limit: 10,
      isRefresh: true,
    })
  }

  showDetail = () => {
    if(this.state.selectCabinet) {
      this.setState({
        showCabinetDetailModal: true,
      })
    }
  }
  hideDetail = () => {
    this.setState({
      showCabinetDetailModal: false,
    })
  }
  showRowDetail = (record, index, event) => {
    this.setState({
      selectCabinet: record,
      showCabinetDetailModal: true,
    })
  }

  showEditModal = () => {
    if(this.state.selectCabinet) {
      this.setState({
        showCabinetEditModal: true,
      })
    }
  }
  hideEditModal = () => {
    this.setState({
      showCabinetEditModal: false,
    })
  }

  render() {
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectCabinet: selectedRows[0]})
      }
    };
    return (
      <div className={style.content}>
        <div className={style.operation}>
          <ButtonGroup>
            <Button icon="info-circle-o" onClick={this.showDetail}>查看</Button>
            <Button icon="link" onClick={this.showEditModal}>关联服务点</Button>
            <Button icon="reload">刷新</Button>
          </ButtonGroup>
        </div>
        <Row>
          <CabinetSearchForm />
        </Row>
        <Table rowKey="deviceNo"
               rowSelection={rowSelection}
               columns={columns}
               dataSource={this.props.cabinetList}
               onRowClick={this.showRowDetail}/>
        <CabinetDetailModal visible={this.state.showCabinetDetailModal}
                            cabinet={this.state.selectCabinet}
                            onOk={this.hideDetail} onCancel={this.hideDetail}/>
        <CabinetEditModal visible={this.state.showCabinetEditModal}
                          cabinet={this.state.selectCabinet}
                          onOk={this.hideEditModal} onCancel={this.hideEditModal}/>
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  let cabinetList = selectCabinets(appState)
  return {
    cabinetList: cabinetList,
  }
}

const mapDispatchToProps = {
  fetchCabinetsAction
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cabinet))

export {saga, reducer} from './redux'
