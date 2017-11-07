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
      loading: true,
      pagination: {
        defaultPageSize: 10,
        showTotal: (total) => `总共 ${total} 条`},
      searchParams: {},
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
  onReload = () => {

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

  handleTableChange = (pagination, filters, sorter) => {
    const {searchParams} = this.state
    const {deviceInfoList, fetchDevicesAction} = this.props

    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({pagination: pager})
    if(deviceInfoList.length < pagination.total
      && pagination.current * (pagination.pageSize + 1) > deviceInfoList.length) {
      fetchDevicesAction({
        ...searchParams,
        lastUpdatedAt: deviceInfoList.length > 0? deviceInfoList[deviceInfoList.length - 1].updatedAt : undefined,
        limit: 10,
        isRefresh: false,
      })
    }
  }

  updateSearchParams = (params, total) => {
    const pager = { ...this.state.pagination }
    pager.total = total
    this.setState({searchParams: params, pagination: pager})
  }

  onSearchStart = () => {
    this.setState({loading: true})
  }

  onSearchEnd = () => {
    this.setState({loading: false})
  }

  render() {
    const {pagination, loading} = this.state
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
            <Button icon="link" onClick={() => {}}>批量操作</Button>
          </ButtonGroup>
        </div>
        <Row>
          <DeviceSearchForm updateSearchParams={this.updateSearchParams}
                            onSearchStart={this.onSearchStart}
                            onSearchEnd={this.onSearchEnd} />
        </Row>
        <Table rowKey="deviceNo"
               rowSelection={rowSelection}
               columns={columns}
               dataSource={this.props.deviceInfoList}
               pagination={pagination}
               loading={loading}
               onChange={this.handleTableChange}
        />
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
  const hasAssociatePermission = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.DEVICE_ASSOCIATE])
  const hasEditPermission = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.DEVICE_EDIT_STATION_ADDR, PERMISSION_CODE.DEVICE_CHANGE_STATION, PERMISSION_CODE.DEVICE_CHANGE_STATUS])
  let deviceInfoList = selector.selectDeviceList(appState)
  return {
    hasAssociatePermission,
    hasEditPermission,
    deviceInfoList: deviceInfoList,
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Device))
