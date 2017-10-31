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
import {selector} from './redux'
import moment from 'moment'
import style from './promotion.module.scss'
import PromotionRecordSearchForm from './PromotionRecordSearchForm'
import mathjs from 'mathjs'


class RedEnvelopePromotionStat extends PureComponent {
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
    const {promotion, redEnvelopeRecordInfolist} = this.props
    const columns = [
      { title: '参与用户', dataIndex: 'mobilePhoneNumber', key: 'mobilePhoneNumber' },
      { title: '红包金额(¥)', dataIndex: 'metadata.amount', key: 'amount' },
      { title: '参与时间', dataIndex: 'createdAt', key: 'createdAt',
        render: (createdAt) => (<span>{moment(new Date(createdAt)).format('LLLL')}</span>) },
    ]
    let surplusAmount = mathjs.chain(promotion.awards.awardAmount).subtract(promotion.stat.winAmount).done()
    return (
      <div className={style.content}>
        <Row type="flex" gutter={24}>
          <Col span={4}>
            <div>{promotion.title}</div>
            <div>{this.getPromotionStatus(promotion)}</div>
          </Col>
          <Col span={12} offset={7}>
            <Card bordered={false}>
              <Card.Grid className={style.card}>
                <div className={style.title}>中奖总金额: </div>
                <div className={style.amount}>{"¥" + Number(promotion.stat.winAmount).toLocaleString() + '元'}</div>
              </Card.Grid>
              <Card.Grid className={style.card}>
                <div className={style.title}>剩余奖金: </div>
                <div className={style.amount}>{"¥" + surplusAmount.toLocaleString() + '元'}</div>
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
        <Table rowKey="id" columns={columns} dataSource={redEnvelopeRecordInfolist}/>
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  const promotionId = ownProps.location.state ? ownProps.location.state.promotionId: undefined
  let promotion = undefined
  let redEnvelopeRecordInfolist = []
  if(promotionId) {
    promotion = selector.selectPromotion(appState, promotionId)
    redEnvelopeRecordInfolist = selector.selectRedEnvelopePromRecordList(appState, promotionId)
  }
  return {
    promotion,
    redEnvelopeRecordInfolist,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RedEnvelopePromotionStat))
