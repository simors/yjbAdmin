/**
 * Created by yangyang on 2017/11/3.
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
import WithdrawSearchForm from './WithdrawSearchForm'

const ButtonGroup = Button.Group

class WithdrawRecords extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      pagination: {
        defaultPageSize: 10,
        showTotal: (total) => `总共 ${total} 条`},
      searchParams: {},
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const {searchParams} = this.state
    const {orderList, fetchOrdersAction} = this.props

    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({pagination: pager})
    if(orderList.length < pagination.total
      && pagination.current * (pagination.pageSize + 1) > orderList.length) {
      fetchOrdersAction({
        ...searchParams,
        lastCreatedAt: orderList.length > 0? orderList[orderList.length - 1].createdAt : undefined,
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
    const {orderList} = this.props
    const columns = [
      { title: '取现单号', dataIndex: 'orderNo', key: 'orderNo' },
      { title: '取现时间', dataIndex: 'start', key: 'start', render: (start) => (<span>{moment(new Date(start)).format('LLLL')}</span>)},
      { title: '用户名', dataIndex: 'nickname', key: 'nickname' },
      { title: '手机号码', dataIndex: 'mobilePhoneNumber', key: 'mobilePhoneNumber' },
      { title: '取现金额(元)', dataIndex: 'amount', key: 'amount' },
    ]
    return (
      <div className={style.content}>
        <div className={style.operation}>
          <ButtonGroup>
            <Button icon="reload">刷新</Button>
          </ButtonGroup>
        </div>
        <Row>
          <WithdrawSearchForm updateSearchParams={this.updateSearchParams}
                           onSearchStart={this.onSearchStart}
                           onSearchEnd={this.onSearchEnd} />
        </Row>
        <Table rowKey="orderNo"
               columns={columns}
               pagination={pagination}
               dataSource={orderList}
               loading={loading}
               onChange={this.handleTableChange}
        />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WithdrawRecords))
