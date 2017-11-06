/**
 * Created by yangyang on 2017/11/5.
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
import WithdrawApplySearchForm from './WithdrawApplySearchForm'
import {actions, DealType, WITHDRAW_STATUS, WITHDRAW_APPLY_TYPE} from './redux'

class WithdrawApply extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchParams: {},
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
    const {pagination, loading, searchParams} = this.state
    let columns = [
      { title: '申请编号', dataIndex: 'id', key: 'id', colSpan: 0,},
      { title: '申请人', dataIndex: 'nickname', key: 'nickname' },
      { title: '手机号码', dataIndex: 'mobilePhoneNumber', key: 'mobilePhoneNumber' },
      { title: '申请日期', dataIndex: 'applyDate', key: 'applyDate', render: (applyDate) => (<span>{moment(new Date(applyDate)).format('LLLL')}</span>) },
      { title: '金额（元）', dataIndex: 'amount', key: 'amount', render: (amount) => (<span>{'¥ ' + Number(amount).toLocaleString()}</span>)},
      { title: '申请类别', dataIndex: 'applyType', key: 'applyType', render: (applyType) => (<span>{'¥ ' + applyType}</span>) },
      { title: '状态', dataIndex: 'status', key: 'status', render: (status) => (<span>{'¥ ' + status}</span>) },
      { title: '操作', key: 'action'}
    ]
    if (Number(searchParams.status) === WITHDRAW_STATUS.DONE) {
      columns.pop()
      columns.push({ title: '操作员', dataIndex: 'operator', key: 'operator' })
      columns.push({ title: '操作时间', dataIndex: 'operateDate', key: 'operateDate', render: (operateDate) => (<span>{moment(new Date(operateDate)).format('LLLL')}</span>) })
    }
    return (
      <div className={style.content}>
        <Row>
          <WithdrawApplySearchForm updateSearchParams={this.updateSearchParams}
                              onSearchStart={this.onSearchStart}
                              onSearchEnd={this.onSearchEnd} />
        </Row>
        <Table rowKey="id"
               columns={columns}
               dataSource={this.props.rechargeList}
               pagination={pagination}
               loading={loading}
        />
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WithdrawApply))
