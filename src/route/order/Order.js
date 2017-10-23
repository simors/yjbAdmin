/**
 * Created by wanpeng on 2017/9/30.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {
  Button,
  Table,
  Row,
  Popover,
} from 'antd'
import mathjs from 'mathjs'
import moment from "moment"
import style from './order.module.scss'
import {OrderStatus, actions, selector} from './redux'
import OrderSearchForm from './OrderSearchForm'

const ButtonGroup = Button.Group

class Order extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchOrdersAction({
      limit: 10,
      isRefresh: true,
    })
  }

  renderDevicePopover = (text, record, index) => {
    const content = (
      <div>
        <label for="deviceNo">编号：</label>
        <input id="deviceNo" type="text" value={record.deviceNo} />
      </div>
    )
    return (
      <Popover content={content} title="干衣柜详情" >
        <span>{text}</span>
      </Popover>
    )
  }

  renderDuration = (text, record, index) => {
    if(record.start && record.end) {
      // let duration = (new Date(record.end) - new Date(record.start)) * 0.001 / 60
      let duration = mathjs.chain(new Date(record.end) - new Date(record.start)).divide(1000).divide(60).done()
      return (<span>{Math.round(duration)}</span>)
    }
    return (<span>--</span>)
  }

  render() {
    const columns = [
      { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo' },
      { title: '下单时间', dataIndex: 'start', key: 'start', render: (start) => (<span>{moment(new Date(start)).format('LLLL')}</span>)},
      { title: '服务点', dataIndex: 'stationName', key: 'stationName' },
      { title: '干衣柜编号', dataIndex: 'deviceNo', key: 'deviceNo', render: this.renderDevicePopover},
      { title: '用户名', dataIndex: 'nickname', key: 'nickname' },
      { title: '手机号码', dataIndex: 'mobilePhoneNumber', key: 'mobilePhoneNumber' },
      { title: '费用(元)', dataIndex: 'amount', key: 'amount' },
      { title: '时长(分钟)', dataIndex: 'duration', key: 'duration', render: this.renderDuration},
      { title: '状态', dataIndex: 'status', key: 'status', render: (status) => {
        switch (status) {
          case OrderStatus.ORDER_STATUS_UNPAID:
            return <span>未支付</span>
            break
          case OrderStatus.ORDER_STATUS_OCCUPIED:
            return <span>使用中</span>
            break
          case OrderStatus.ORDER_STATUS_PAID:
            return <span>已支付</span>
            break
          default:
            break
        }
      }},
    ]
    return (
      <div className={style.content}>
        <div className={style.operation}>
          <ButtonGroup>
            <Button icon="info-circle-o" onClick={this.showDetail}>查看</Button>
            <Button icon="reload">刷新</Button>
          </ButtonGroup>
        </div>
        <Row>
          <OrderSearchForm />
        </Row>
        <Table rowKey="orderNo"
               columns={columns}
               dataSource={this.props.orderList}/>
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  let orderList = selector.selectOrderList(appState)
  return {
    orderList: orderList,
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Order))
