/**
 * Created by yangyang on 2017/11/5.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {
  Table,
  Row,
  Popconfirm,
  message,
} from 'antd'
import moment from "moment"
import style from './order.module.scss'
import WithdrawApplySearchForm from './WithdrawApplySearchForm'
import {WITHDRAW_STATUS, WITHDRAW_APPLY_TYPE, selector, actions, DEAL_TYPE} from './redux'
import * as errno from '../../errno'

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

  agreeWithdraw(record) {
    console.log('record', record)
    let dealType = undefined
    if (record.applyType === WITHDRAW_APPLY_TYPE.PROFIT) {
      dealType = DEAL_TYPE.WITHDRAW
    } else if (record.applyType === WITHDRAW_APPLY_TYPE.REFUND) {
      dealType = DEAL_TYPE.REFUND
    }
    this.props.requestWithdraw({
      amount: record.amount,
      channel: 'wx_pub',
      metadata: {
        'fromUser': 'platform',
        'toUser': record.userId,
        'dealType': dealType
      },
      openid: record.openid,
      username: '',
      success: () => {
        message.success('取现申请提交成功，请稍后查看收益余额及微信钱包')
      },
      error: (error) => {
        switch (error.code) {
          case errno.ERROR_IN_WITHDRAW_PROCESS:
            message.error('最近已提交过申请，请等待上一笔取现申请处理完后再重新取现')
            break
          case errno.ERROR_NOT_ENOUGH_MONEY:
            message.error('余额不足')
            break
          case errno.ERROR_NOT_WITHDRAW_DATE:
            message.error('只允许在每个月的10号到15号提交取现申请')
            break
          case errno.ERROR_UNSUPPORT_CHANNEL:
            message.error('不支持的取现渠道')
            break
          default:
            message.error('提现失败，请联系客服')
        }
      }
    })
  }

  renderOperateCol = (record) => {
    return (
      <span>
        <Popconfirm title="确定通过取现申请吗？" onConfirm={() => {this.agreeWithdraw(record)}} okText="确定" cancelText="取消">
          <a style={{color: `blue`}} href="#">同意</a>
        </Popconfirm>
      </span>
    )
  }

  render() {
    const {loading, searchParams} = this.state
    let columns = [
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
      { title: '操作', key: 'action', render: this.renderOperateCol}
    ]
    if (Number(searchParams.status) === WITHDRAW_STATUS.DONE) {
      columns.pop()
      columns.push({ title: '操作员', dataIndex: 'operatorName', key: 'operatorName' })
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
  return {
    withdrawApplyList,
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WithdrawApply))
