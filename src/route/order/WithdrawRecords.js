/**
 * Created by yangyang on 2017/11/3.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {
  Button,
  Table,
  Row,
} from 'antd'
import moment from "moment"
import style from './order.module.scss'
import {DealType, actions, selector} from './redux'
import WithdrawSearchForm from './WithdrawSearchForm'

const ButtonGroup = Button.Group

class WithdrawRecords extends React.PureComponent {
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
    const {withdrawList, fetchDealAction} = this.props

    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({pagination: pager})
    if(withdrawList.length < pagination.total
      && pagination.current * (pagination.pageSize + 1) > withdrawList.length) {
      fetchDealAction({
        ...searchParams,
        dealType: DealType.DEAL_TYPE_WITHDRAW,
        lastDealTime: withdrawList.length > 0? withdrawList[withdrawList.length - 1].dealTime : undefined,
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
    const {withdrawList} = this.props
    const columns = [
      { title: '取现单号', dataIndex: 'orderNo', key: 'orderNo' },
      { title: '取现时间', dataIndex: 'dealTime', key: 'dealTime', render: (dealTime) => (<span>{moment(new Date(dealTime)).format('LLLL')}</span>)},
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
               dataSource={withdrawList}
               loading={loading}
               onChange={this.handleTableChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  let withdrawList = selector.selectDealRecordList(appState, DealType.DEAL_TYPE_WITHDRAW)
  return {
    withdrawList,
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WithdrawRecords))
