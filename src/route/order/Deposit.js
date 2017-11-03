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
      searchParams: {},
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const {searchParams} = this.state
    const {depositList, fetchDepositAction} = this.props

    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({pagination: pager})
    if(depositList.length < pagination.total
      && pagination.current * (pagination.pageSize + 1) > depositList.length) {
      fetchDepositAction({
        ...searchParams,
        lastDealTime: depositList.length > 0? depositList[depositList.length - 1].dealTime : undefined,
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
    const columns = [
      { title: '押金单号', dataIndex: 'orderNo', key: 'orderNo' },
      { title: '交易时间', dataIndex: 'dealTime', key: 'dealTime', render: (dealTime) => (<span>{moment(new Date(dealTime)).format('LLLL')}</span>) },
      { title: '用户名', dataIndex: 'nickname', key: 'nickname' },
      { title: '手机号码', dataIndex: 'mobilePhoneNumber', key: 'mobilePhoneNumber' },
      { title: '金额', dataIndex: 'amount', key: 'amount',
        render: (amount, record) => {
          if(record.dealType === DealType.DEAL_TYPE_DEPOSIT) {
            return(<span>{'¥ ' + amount}</span>)
          } else if(record.dealType === DealType.DEAL_TYPE_REFUND) {
            return(<span>{'¥ ' + (-amount)}</span>)
          } else {
            return(<span>--</span>)
          }
        }
      },
    ]
    return (
      <div className={style.content}>
        <div className={style.operation}>
          <ButtonGroup>
            <Button icon="info-circle-o">查看</Button>
            <Button icon="reload">刷新</Button>
          </ButtonGroup>
        </div>
        <Row>
          <DepositSearchForm updateSearchParams={this.updateSearchParams}
                              onSearchStart={this.onSearchStart}
                              onSearchEnd={this.onSearchEnd} />
        </Row>
        <Table rowKey="orderNo"
               columns={columns}
               dataSource={this.props.depositList}
               pagination={pagination}
               loading={loading}
               onChange={this.handleTableChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  let depositList = selector.selectDepositList(appState)
  return {
    depositList: depositList,
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Deposit))
