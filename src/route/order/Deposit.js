/**
 * Created by wanpeng on 2017/11/3.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {actions, selector, DealType} from './redux'
import style from './order.module.scss'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {
  Button,
  Table,
  Row,
  Popover,
} from 'antd'
import moment from "moment"
import DepositSearchForm from './DepositSearchForm'
const ButtonGroup = Button.Group

class Deposit extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      pagination: {
        defaultPageSize: 10,
        showTotal: (total) => `总共 ${total} 条`},
      searchParams: {dealType: DealType.DEAL_TYPE_DEPOSIT},
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const {searchParams} = this.state
    const {depositList, refundList, fetchDealAction} = this.props
    let currentList = depositList
    if(searchParams.dealType === DealType.DEAL_TYPE_DEPOSIT) {
      currentList = refundList
    }

    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({pagination: pager})
    if(currentList.length < pagination.total
      && pagination.current * (pagination.pageSize + 1) > currentList.length) {
      fetchDealAction({
        ...searchParams,
        lastDealTime: currentList.length > 0? currentList[currentList.length - 1].dealTime : undefined,
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

  getCurrentList() {
    const {searchParams} = this.state
    const {depositList, refundList} = this.props
    let list = undefined
    if(searchParams.dealType === DealType.DEAL_TYPE_REFUND) {
      list = refundList
    } else if(searchParams.dealType === DealType.DEAL_TYPE_DEPOSIT) {
      list = depositList
    }
    console.log("searchParams", searchParams)
    console.log("list:", list)
    return list
  }

  render() {
    const {pagination, loading} = this.state
    const columns = [
      { title: '押金单号', dataIndex: 'orderNo', key: 'orderNo' },
      { title: '交易时间', dataIndex: 'dealTime', key: 'dealTime', render: (dealTime) => (<span>{moment(new Date(dealTime)).format('LLLL')}</span>) },
      { title: '用户名', dataIndex: 'nickname', key: 'nickname' },
      { title: '手机号码', dataIndex: 'mobilePhoneNumber', key: 'mobilePhoneNumber' },
      { title: '金额(元)', dataIndex: 'amount', key: 'amount',
        render: (amount, record) => {
          if(record.dealType === DealType.DEAL_TYPE_DEPOSIT) {
            return(<span style={{color: 'green', fontWeight: 'bold'}}>{'  ¥ ' + amount}</span>)
          } else if(record.dealType === DealType.DEAL_TYPE_REFUND) {
            return(<span style={{color: 'red', fontWeight: 'bold'}}>{'-¥ ' + amount}</span>)
          } else {
            return(<span>--</span>)
          }
        }
      },
    ]
    return (
      <div className={style.content}>
        <Row>
          <DepositSearchForm updateSearchParams={this.updateSearchParams}
                              onSearchStart={this.onSearchStart}
                              onSearchEnd={this.onSearchEnd} />
        </Row>
        <Table rowKey="orderNo"
               columns={columns}
               dataSource={this.getCurrentList()}
               pagination={pagination}
               loading={loading}
               onChange={this.handleTableChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  let depositList = selector.selectDealRecordList(appState, DealType.DEAL_TYPE_DEPOSIT)
  let refundList = selector.selectDealRecordList(appState, DealType.DEAL_TYPE_REFUND)
  return {
    depositList: depositList,
    refundList: refundList,
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Deposit))
