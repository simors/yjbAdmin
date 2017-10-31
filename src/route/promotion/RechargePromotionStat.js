/**
 * Created by wanpeng on 2017/10/21.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {
  Button,
  Table,
  Row,
  Col,
  Card
} from 'antd'
import {selector} from './redux'
import moment from 'moment'
import style from './promotion.module.scss'
import PromotionRecordSearchForm from './PromotionRecordSearchForm'

class RechargePromotionStat extends PureComponent {
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
    const {promotion, rechargeRecordInfolist} = this.props
    const columns = [
      { title: '参与用户', dataIndex: 'mobilePhoneNumber', key: 'mobilePhoneNumber' },
      { title: '充值金额(¥)', dataIndex: 'metadata.recharge', key: 'recharge' },
      { title: '赠送金额(¥)', dataIndex: 'metadata.award', key: 'award' },
      { title: '参与时间', dataIndex: 'createdAt', key: 'createdAt',
        render: (createdAt) => (<span>{moment(new Date(createdAt)).format('LLLL')}</span>) },
    ]
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
                <div className={style.title}>充值总额:</div>
                <div className={style.amount}>{"¥" + Number(promotion.stat.rechargeAmount).toLocaleString() + '元'}</div>
              </Card.Grid>
              <Card.Grid className={style.card}>
                <div className={style.title}>赠送总额:</div>
                <div className={style.amount}>{"¥" + Number(promotion.stat.awardAmount).toLocaleString() + '元'}</div>
              </Card.Grid>
              <Card.Grid className={style.card}>
                <div className={style.title}>参与人数:</div>
                <div className={style.amount}>{Number(promotion.stat.participant).toLocaleString()}</div>
              </Card.Grid>
            </Card>
          </Col>
        </Row>
        <hr/>
        <Row>
          <PromotionRecordSearchForm promotion={promotion}/>
        </Row>
        <Table rowKey="id" columns={columns} dataSource={rechargeRecordInfolist}/>
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  const promotionId = ownProps.location.state ? ownProps.location.state.promotionId: undefined
  let promotion = undefined
  let rechargeRecordInfolist = []
  if(promotionId) {
    promotion = selector.selectPromotion(appState, promotionId)
    rechargeRecordInfolist = selector.selectRechargePromRecordList(appState, promotionId)
  }
  return {
    promotion: promotion,
    rechargeRecordInfolist: rechargeRecordInfolist,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RechargePromotionStat))
