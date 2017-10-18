/**
 * Created by wanpeng on 2017/10/17.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {PromotionStatus} from './redux'
import {
  Row,
  Col,
  Input,
  Select,
  Modal,
  Radio,
  DatePicker,
} from 'antd'
import style from './promotion.module.scss'
import moment from 'moment'
import DivisionCascader from '../../component/DivisionCascader'
import AwardsInput from './AwardsInput'

const RangePicker = DatePicker.RangePicker
const TextArea = Input.TextArea

class PromotionDetailModal extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const dateFormat = 'YYYY-MM-DD'
    let promotion = this.props.promotion
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
              <Input disabled={true} value={this.props.promotion.title} />
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>活动起始时间</Col>
            <Col span={10}>
              <RangePicker disabled value={[moment(promotion.start, dateFormat), moment(promotion.end, dateFormat)]}/>
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>活动区域</Col>
            <Col span={10}>
              <DivisionCascader disabled={true} value={promotion.region} />
            </Col>
          </Row>
          <Row className={style.modalItem} type='flex' gutter={16} align='middle'>
            <Col span={4}>充值奖励金额</Col>
            <Col span={14}>
              <AwardsInput disabled={true} value={promotion.awards.rechargeList} />
            </Col>
          </Row>
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
  return {
  }
}

export default connect(mapStateToProps)(PromotionDetailModal)

