/**
 * Created by wanpeng on 2017/9/30.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {actions, selector, deviceStatus} from './redux'
import {
  Button,
  Table,
  Row,
} from 'antd'
import style from './device.module.scss'
import DeviceSearchForm from './DeviceSearchForm'
import DeviceDetailModal from './DeviceDetailModal'
import DeviceAssociateModal from './DeviceAssociateModal'
import DeviceEditModal from './DeviceEditModal'
import {selector as authSelector} from '../../util/auth/'
import {PERMISSION_CODE} from '../../util/rolePermission/'

const ButtonGroup = Button.Group

class Device extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showDeviceDetailModal: false,
      selectDevice: undefined,
      showDeviceAssociateModal: false,
      showDeviceEditModal: false,
    }
  }

  componentWillMount() {
    this.props.fetchDevicesAction({
      limit: 10,
      isRefresh: true,
    })
  }

  showDetail = () => {
    if(this.state.selectDevice) {
      this.setState({
        showDeviceDetailModal: true,
      })
    }
  }

  showRowDetail(record) {
    this.setState({
      selectDevice: record,
      showDeviceDetailModal: true,
    })
  }

  showEditModal(record) {
    this.setState({
      selectDevice: record,
      showDeviceAssociateModal: true,
    })
  }

  showRowEditModal(record) {
    this.setState({
      selectDevice: record,
      showDeviceEditModal: true,
    })
  }

  renderOperateCol = (record) => {
    let {hasAssociatePermission, hasEditPermission} = this.props
    if(record.status === deviceStatus.DEVICE_STATUS_UNREGISTER) {
      if (hasAssociatePermission) {
        return (
          <span>
            <a style={{color: `blue`}} onClick={() => {this.showRowDetail(record)}}>详情</a>
            <span className="ant-divider" />
            <a style={{color: `red`}} onClick={() => {this.showEditModal(record)}}>关联</a>
          </span>
        )
      } else {
        return (
          <span>
            <a style={{color: `blue`}} onClick={() => {this.showRowDetail(record)}}>详情</a>
          </span>
        )
      }
    }
    if (hasEditPermission) {
      return (
        <span>
          <a style={{color: `blue`}} onClick={() => {this.showRowDetail(record)}}>详情</a>
          <span className="ant-divider" />
          <a style={{color: `blue`}} onClick={() => {this.showRowEditModal(record)}}>编辑</a>
        </span>
      )
    } else {
      return (
        <span>
          <a style={{color: `blue`}} onClick={() => {this.showRowDetail(record)}}>详情</a>
        </span>
      )
    }
  }

  render() {
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectDevice: selectedRows[0]})
      }
    };
    const columns = [
      { title: '编号', dataIndex: 'deviceNo', key: 'deviceNo' },
      { title: '干衣柜位置', dataIndex: 'deviceAddr', key: 'deviceAddr' },
      { title: '服务点', dataIndex: 'stationName', key: 'stationName' },
      { title: '上线日期', dataIndex: 'onlineTime', key: 'onlineTime', render: (onlineTime) => <span>{onlineTime.slice(0, 10)}</span> },
      { title: '状态', dataIndex: 'status', key: 'status', render: (status) => {
        switch (status) {
          case deviceStatus.DEVICE_STATUS_IDLE:
            return <span>空闲</span>
            break
          case deviceStatus.DEVICE_STATUS_OCCUPIED:
            return <span>使用中</span>
            break
          case deviceStatus.DEVICE_STATUS_OFFLINE:
            return <span>下线</span>
            break
          case deviceStatus.DEVICE_STATUS_FAULT:
            return <span>故障</span>
            break
          case deviceStatus.DEVICE_STATUS_MAINTAIN:
            return <span>维修保养</span>
            break
          case deviceStatus.DEVICE_STATUS_UNREGISTER:
            return <span>未注册</span>
            break
          default:
            break
        }
      }},
      { title: '操作', key: 'action', render: this.renderOperateCol}
    ];
    return (
      <div className={style.content}>
        <div className={style.operation}>
          <ButtonGroup>
            <Button icon="info-circle-o" onClick={this.showDetail}>查看</Button>
            <Button icon="link" onClick={() => {}}>批量操作</Button>
            <Button icon="reload">刷新</Button>
          </ButtonGroup>
        </div>
        <Row>
          <DeviceSearchForm />
        </Row>
        <Table rowKey="deviceNo"
               rowSelection={rowSelection}
               columns={columns}
               dataSource={this.props.deviceInfoList}/>
        {
          this.state.showDeviceDetailModal ?
            <DeviceDetailModal device={this.state.selectDevice}
                               onOk={() => {this.setState({showDeviceDetailModal: false})}}
                               onCancel={() => {this.setState({showDeviceDetailModal: false})}}/>
            : null
        }

        <DeviceAssociateModal visible={this.state.showDeviceAssociateModal}
                              device={this.state.selectDevice}
                              onCancel={() => {this.setState({showDeviceAssociateModal: false})}}/>
        {
          this.state.showDeviceEditModal ?
            <DeviceEditModal device={this.state.selectDevice} onCancel={() => {this.setState({showDeviceEditModal: false})}} />
            : null
        }
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  const hasEditPermission = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.DEVICE_EDIT])
  const hasAssociatePermission = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.DEVICE_ASSOCIATE])
  let deviceInfoList = selector.selectDeviceList(appState)
  return {
    hasEditPermission,
    hasAssociatePermission,
    deviceInfoList: deviceInfoList,
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Device))
