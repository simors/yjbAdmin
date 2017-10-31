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

  render() {
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
          <PromotionRecordSearchForm promotion={promotion}/>
        </Row>
        <Table rowKey="id" columns={columns} dataSource={scoreRecordInfolist}/>
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

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScorePromotionStat))
