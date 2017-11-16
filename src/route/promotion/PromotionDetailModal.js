/**
 * Created by wanpeng on 2017/10/17.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Modal,
  Radio,
  DatePicker,
} from 'antd'
import style from './promotion.module.scss'
import moment from 'moment'
import DivisionCascader from '../../component/DivisionCascader'
import AwardsInput from './AwardsInput'
import {PromotionCategoryType, selector} from './redux'
import RedEnvelopeParamsInput from './RedEnvelopeParamsInput'
import GiftsInput from './GiftsInput'

const RangePicker = DatePicker.RangePicker
const TextArea = Input.TextArea

class PromotionDetailModal extends PureComponent {
  constructor(props) {
    super(props)
  }

  renderCategoryParams() {
    const {promotion, category} = this.props

    switch (category.type) {
      case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_RECHARGE:
      {
        return (
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>充值奖励金额</Col>
            <Col span={14}>
              <AwardsInput disabled={true} value={promotion.awards.rechargeList} />
            </Col>
          </Row>
        )
      }
      case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_SCORE:
      {
        return (
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>积分倍率</Col>
            <Col span={14}>
              <InputNumber disabled={true}
                           value={promotion.awards.rate}
                           formatter={value => `x${value}`}
                           parser={value => value.replace('x', '')}
                           style={{ width: '30%' }}/>
            </Col>
          </Row>
        )
      }
      case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_REDENVELOPE:
      {
        return (
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>红包参数</Col>
            <Col span={20}>
              <RedEnvelopeParamsInput disabled={true} value={promotion.awards} />
            </Col>
          </Row>
        )
        break
      }
      case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_EXCHANGE_SCORE:
      {
        return(
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>兑换礼品</Col>
            <Col span={20}>
              <GiftsInput disabled={true} value={promotion.awards.gifts} />
            </Col>
          </Row>
        )
      }
      default:
      {
        return null
      }
    }
  }

  render() {
    const dateFormat = 'YYYY-MM-DD'
    const {promotion} = this.props
    if(promotion) {
      return (
        <Modal title="活动详情"
               width={720}
               visible={this.props.visible}
               onOk={this.props.onOk}
               onCancel={this.props.onCancel}>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>活动名称</Col>
            <Col span={6}>
              <Input disabled={true} value={promotion.title} />
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>活动起始时间</Col>
            <Col span={10}>
              <RangePicker disabled value={[moment(new Date(promotion.start), dateFormat), moment(new Date(promotion.end), dateFormat)]}/>
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>活动区域</Col>
            <Col span={10}>
              <DivisionCascader showType='search' disabled={true} value={promotion.region} />
            </Col>
          </Row>
          {this.renderCategoryParams()}
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>活动描述</Col>
            <Col span={10}>
              <TextArea disabled={true} value={promotion.description} />
            </Col>
          </Row>
        </Modal>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (appState, ownProps) => {
  const {promotion} = ownProps
  let category = undefined
  if(promotion) {
    category = selector.selectCategory(appState, promotion.categoryId)
  }
  return {
    category: category,
  }
}

export default connect(mapStateToProps)(PromotionDetailModal)

