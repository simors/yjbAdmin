/**
 * Created by wanpeng on 2017/10/4.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {actions, selector} from './redux'
import style from './order.module.scss'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {
  Button,
  Table,
  Row,
  Popover,
} from 'antd'
import moment from "moment"
import RechargeSearchForm from './RechargeSearchForm'
const ButtonGroup = Button.Group


class Recharge extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      pagination: {
        defaultPageSize: 3,
        showTotal: (total) => `总共 ${total} 条`},
      searchParams: {},
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const {searchParams} = this.state
    const {rechargeList, fetchRechargesAction} = this.props

    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({pagination: pager})
    if(rechargeList.length < pagination.total
      && pagination.current * (pagination.pageSize + 1) > rechargeList.length) {
      fetchRechargesAction({
        ...searchParams,
        lastDealTime: rechargeList.length > 0? rechargeList[rechargeList.length - 1].dealTime : undefined,
        limit: 3,
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
      { title: '充值单号', dataIndex: 'orderNo', key: 'orderNo' },
      { title: '充值时间', dataIndex: 'dealTime', key: 'dealTime', render: (dealTime) => (<span>{moment(new Date(dealTime)).format('LLLL')}</span>) },
      { title: '用户名', dataIndex: 'nickname', key: 'nickname' },
      { title: '手机号码', dataIndex: 'mobilePhoneNumber', key: 'mobilePhoneNumber' },
      { title: '充值金额', dataIndex: 'amount', key: 'amount', render: (amount) => (<span>{'¥ ' + amount}</span>) },
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
          <RechargeSearchForm updateSearchParams={this.updateSearchParams}
                              onSearchStart={this.onSearchStart}
                              onSearchEnd={this.onSearchEnd} />
        </Row>
        <Table rowKey="orderNo"
               columns={columns}
               dataSource={this.props.rechargeList}
               pagination={pagination}
               loading={loading}
               onChange={this.handleTableChange}
        />
      </div>
    )
  }

}

const mapStateToProps = (appState, ownProps) => {
  let rechargeList = selector.selectRechargeList(appState)
  return {
    rechargeList: rechargeList,
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Recharge))
