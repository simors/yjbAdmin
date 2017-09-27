/**
 * Created by wanpeng on 2017/9/19.
 */
import React, {PureComponent} from 'react'
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
import CabinetAssociateModal from './CabinetAssociateModal'
import CabinetEditModal from './CabinetEditModal'

const ButtonGroup = Button.Group

class Cabinet extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showCabinetDetailModal: false,
      selectCabinet: undefined,
      showCabinetAssociateModal: false,
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

  showRowDetail(record) {
    this.setState({
      selectCabinet: record,
      showCabinetDetailModal: true,
    })
  }

  showEditModal(record) {
    this.setState({
      selectCabinet: record,
      showCabinetAssociateModal: true,
    })
  }

  showRowEditModal(record) {
    this.setState({
      selectCabinet: record,
      showCabinetEditModal: true,
    })
  }

  render() {
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectCabinet: selectedRows[0]})
      }
    };
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
      }},
      // TODO: 通过权限生成操作按钮
      { title: '操作', key: 'action', render: (record) => {
        if(record.status === cabinetStatus.DEVICE_STATUS_UNREGISTER) {
          return (<a style={{color: `red`}} onClick={() => {this.showEditModal(record)}}>关联</a>)
        }
        return (
        <span>
          <a style={{color: `blue`}} onClick={() => {this.showRowDetail(record)}}>详情</a>
          <span className="ant-divider" />
          <a style={{color: `blue`}} onClick={() => {this.showRowEditModal(record)}}>编辑</a>
        </span>
        )
      }}
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
          <CabinetSearchForm />
        </Row>
        <Table rowKey="deviceNo"
               rowSelection={rowSelection}
               columns={columns}
               dataSource={this.props.cabinetList}/>
        <CabinetDetailModal visible={this.state.showCabinetDetailModal}
                            cabinet={this.state.selectCabinet}
                            onOk={() => {this.setState({showCabinetDetailModal: false})}}
                            onCancel={() => {this.setState({showCabinetDetailModal: false})}}/>
        <CabinetAssociateModal visible={this.state.showCabinetAssociateModal}
                          cabinet={this.state.selectCabinet}
                          onCancel={() => {this.setState({showCabinetAssociateModal: false})}}/>
        <CabinetEditModal visible={this.state.showCabinetEditModal}
                          cabinet={this.state.selectCabinet}
                          onCancel={() => {this.setState({showCabinetEditModal: false})}} />
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
