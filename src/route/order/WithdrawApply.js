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
import {WITHDRAW_STATUS, WITHDRAW_APPLY_TYPE, selector} from './redux'

class WithdrawApply extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchParams: {},
    }
  }

  updateSearchParams = (params) => {
    this.setState({searchParams: params})
  }

  onSearchStart = () => {
    this.setState({loading: true})
  }

  onSearchEnd = () => {
    this.setState({loading: false})
  }

  render() {
    const {loading, searchParams} = this.state
    let columns = [
      { title: '申请编号', dataIndex: 'id', key: 'id', colSpan: 0,},
      { title: '申请人', dataIndex: 'nickname', key: 'nickname' },
      { title: '手机号码', dataIndex: 'mobilePhoneNumber', key: 'mobilePhoneNumber' },
      { title: '申请日期', dataIndex: 'applyDate', key: 'applyDate', render: (applyDate) => (<span>{moment(new Date(applyDate)).format('LLLL')}</span>) },
      { title: '金额（元）', dataIndex: 'amount', key: 'amount', render: (amount) => (<span>{'¥ ' + Number(amount).toLocaleString()}</span>)},
      { title: '申请类别', dataIndex: 'applyType', key: 'applyType', render: (applyType) => {
        switch (applyType) {
          case WITHDRAW_APPLY_TYPE.PROFIT:
            return <span>收益取现</span>
          case WITHDRAW_APPLY_TYPE.REFUND:
            return <span>押金返还</span>
          default:
            return <span>未知类别</span>
        }
      } },
      { title: '状态', dataIndex: 'status', key: 'status', render: (status) => {
        switch (status) {
          case WITHDRAW_STATUS.APPLYING:
            return <span style={{color: 'red'}}>等待处理</span>
          case WITHDRAW_STATUS.DONE:
            return <span style={{color: 'green'}}>处理完成</span>
          default:
            return <span>未知状态</span>
        }
      } },
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
               dataSource={this.props.withdrawApplyList}
               loading={loading}
        />
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  let withdrawApplyList = selector.selectWithdrawApplyList(appState)
  console.log('withdrawApplyList', withdrawApplyList)
  return {
    withdrawApplyList,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WithdrawApply))
