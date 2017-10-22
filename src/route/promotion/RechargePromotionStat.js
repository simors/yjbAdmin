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
} from 'antd'
import {selector} from './redux'
import moment from 'moment'
import style from './promotion.module.scss'
import RechargeRecordSearchForm from './RechargeRecordSearchForm'

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
      { title: '充值金额(¥)', dataIndex: 'recharge', key: 'recharge' },
      { title: '赠送金额(¥)', dataIndex: 'award', key: 'award' },
      { title: '参与时间', dataIndex: 'createdAt', key: 'createdAt',
        render: (createdAt) => (<span>{moment(createdAt).format('LLLL')}</span>) },
    ]
    return (
      <div className={style.content}>
        <Row type="flex" gutter={24}>
          <Col span={4}>
            <div>{promotion.title}</div>
            <div>{this.getPromotionStatus(promotion)}</div>
          </Col>
          <Col span={3} offset={9}>
            <div>充值总额</div>
            <div>{"¥" + promotion.stat.rechargeAmount + '元'}</div>
          </Col>
          <Col span={3}>
            <div>赠送总额</div>
            <div>{"¥" + promotion.stat.awardAmount + '元'}</div>
          </Col>
          <Col span={3}>
            <div>参与人数</div>
            <div>{"¥" + promotion.stat.participant + '元'}</div>
          </Col>
        </Row>
        <hr/>
        <Row>
          <RechargeRecordSearchForm promotion={promotion}/>
        </Row>
        <Table rowKey="id" columns={columns} dataSource={rechargeRecordInfolist}/>
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  const promotionId = ownProps.location.state ? ownProps.location.state.promotionId: undefined
  let promotion = undefined
  if(promotionId) {
    promotion = selector.selectPromotion(appState, promotionId)
  }
  let rechargeRecordInfolist = selector.selectRechargePromRecordList(appState)
  return {
    promotion: promotion,
    rechargeRecordInfolist: rechargeRecordInfolist,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RechargePromotionStat))
