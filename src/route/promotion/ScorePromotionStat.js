/**
 * Created by wanpeng on 2017/10/25.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {
  Button,
  Table,
  Row,
  Col,
  Card,
} from 'antd'
import {selector, ScoreType} from './redux'
import moment from 'moment'
import style from './promotion.module.scss'
import PromotionRecordSearchForm from './PromotionRecordSearchForm'


class ScorePromotionStat extends PureComponent {
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

  getPromotionStatus(promotion) {
    if(promotion.disabled) {
      return '禁用'
    } else {
      if (moment().isBefore(promotion.start)) {
        return '待触发'
      } else if (moment().isSameOrAfter(promotion.start) && moment().isSameOrBefore(promotion.end)) {
        return '进行中'
      } else if (moment().isAfter(promotion.end)) {
        return '结束'
      }
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

  handleTableChange = (pagination, filters, sorter) => {
    const {searchParams} = this.state
    const {scoreRecordInfolist} = this.props

    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({pagination: pager})
    if(scoreRecordInfolist.length < pagination.total
      && pagination.current * (pagination.pageSize + 1) > scoreRecordInfolist.length) {
      this.props.fetchOrdersAction({
        ...searchParams,
        lastCreatedAt: scoreRecordInfolist.length > 0? scoreRecordInfolist[scoreRecordInfolist.length - 1].createdAt : undefined,
        limit: 10,
        isRefresh: false,
      })
    }
  }

  render() {
    const {pagination, loading} = this.state
    const {promotion, scoreRecordInfolist} = this.props
    const columns = [
      { title: '参与用户', dataIndex: 'mobilePhoneNumber', key: 'mobilePhoneNumber' },
      { title: '赠送积分', dataIndex: 'metadata.score', key: 'score' },
      { title: '操作', dataIndex: 'metadata.type', key: 'type', render: (type) => {
        console.log("type", type)
        switch (type) {
          case ScoreType.SCORE_OP_TYPE_DEPOSIT:
            return(<span>押金</span>)
          case ScoreType.SCORE_OP_TYPE_BIND_PHONE:
            return(<span>绑定手机</span>)
          case ScoreType.SCORE_OP_TYPE_EXCHANGE:
            return(<span>积分兑换</span>)
          case ScoreType.SCORE_OP_TYPE_FOCUS:
            return(<span>关注公众号</span>)
          case ScoreType.SCORE_OP_TYPE_ID_AUTH:
            return(<span>实名认证</span>)
          case ScoreType.SCORE_OP_TYPE_RECHARGE:
            return(<span>充值</span>)
          default:
            return null
        }
      }},
      { title: '参与时间', dataIndex: 'createdAt', key: 'createdAt',
        render: (createdAt) => (<span>{moment(new Date(createdAt)).format('LLLL')}</span>)},
    ]
    return (
      <div className={style.content}>
        <Row type="flex" gutter={24}>
          <Col span={4}>
            <div>{promotion.title}</div>
            <div>{this.getPromotionStatus(promotion)}</div>
          </Col>
          <Col span={8} offset={9}>
            <Card bordered={false}>
              <Card.Grid className={style.card}>
                <div className={style.title}>赠送总积分: </div>
                <div className={style.amount}>{Number(promotion.stat.scoreAmount).toLocaleString()}</div>
              </Card.Grid>
              <Card.Grid className={style.card}>
                <div className={style.title}>参与人数: </div>
                <div className={style.amount}>{Number(promotion.stat.participant).toLocaleString()}</div>
              </Card.Grid>
            </Card>
          </Col>
        </Row>
        <hr/>
        <Row>
          <PromotionRecordSearchForm promotion={promotion}
                                     updateSearchParams={this.updateSearchParams}
                                     onSearchStart={this.onSearchStart}
                                     onSearchEnd={this.onSearchEnd}/>
        </Row>
        <Table rowKey="id"
               columns={columns}
               dataSource={scoreRecordInfolist}
               pagination={pagination}
               loading={loading}
               onChange={this.handleTableChange}

        />
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  const promotionId = ownProps.location.state ? ownProps.location.state.promotionId: undefined
  let promotion = undefined
  let scoreRecordInfolist = []
  if(promotionId) {
    promotion = selector.selectPromotion(appState, promotionId)
    scoreRecordInfolist = selector.selectScorePromRecordList(appState, promotionId)
  }
  return {
    promotion,
    scoreRecordInfolist,
  }
}


export default withRouter(connect(mapStateToProps)(ScorePromotionStat))
