/**
 * Created by wanpeng on 2017/10/26.
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

class ScoreExchangePromStat extends PureComponent {
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
    const {promotion, scoreExchangeRecordInfoList} = this.props
    const columns = [
      { title: '参与用户', dataIndex: 'mobilePhoneNumber', key: 'mobilePhoneNumber' },
      { title: '使用积分', dataIndex: 'metadata.scores', key: 'scores' },
      { title: '兑换礼品', dataIndex: 'metadata.gift', key: 'gift' },
      { title: '预留手机号码', dataIndex: 'metadata.phone', key: 'phone' },
      { title: '预留地址', dataIndex: 'metadata.addr', key: 'addr' },
      { title: '参与时间', dataIndex: 'createdAt', key: 'createdAt',
        render: (createdAt) => (<span>{moment(new Date(createdAt)).format('LLLL')}</span>)},
    ]
    return(
      <div className={style.content}>
        <Row type="flex" gutter={24}>
          <Col span={4}>
            <div>{promotion.title}</div>
            <div>{this.getPromotionStatus(promotion)}</div>
          </Col>
          <Col span={10} offset={9}>
            <Card bordered={false}>
              <Card.Grid className={style.card}>
                <div className={style.title}>总兑换积分: </div>
                <div className={style.amount}>{promotion.stat.scoreAmount}</div>
              </Card.Grid>
              <Card.Grid className={style.card}>
                <div className={style.title}>参与人数: </div>
                <div className={style.amount}>{promotion.stat.participant}</div>
              </Card.Grid>
            </Card>
          </Col>
        </Row>
        <hr/>
        <Row>
          <PromotionRecordSearchForm promotion={promotion}/>
        </Row>
        <Table rowKey="id" columns={columns} dataSource={scoreExchangeRecordInfoList}/>
      </div>
    )
  }

}

const mapStateToProps = (appState, ownProps) => {
  const promotionId = ownProps.location.state ? ownProps.location.state.promotionId: undefined
  let promotion = undefined
  let scoreExchangeRecordInfoList = []
  if(promotionId) {
    promotion = selector.selectPromotion(appState, promotionId)
    scoreExchangeRecordInfoList = selector.selectScoreExchangePromRecordList(appState, promotionId)
  }
  return {
    promotion,
    scoreExchangeRecordInfoList,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScoreExchangePromStat))
