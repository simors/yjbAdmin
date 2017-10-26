/**
 * Created by wanpeng on 2017/10/17.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
  Modal,
} from 'antd'
import {selector, PromotionCategoryType} from './redux'
import RechargePromEditForm from './RechargePromEditForm'
import RedEnvelopePromEditForm from './RedEnvelopePromEditForm'
import ScorePromotionEditForm from './ScorePromotionEditForm'
import ScoreExchangePromEditForm from './ScoreExchangePromEditForm'

class PromotionEditModal extends PureComponent {
  constructor(props) {
    super(props)
  }

  onSubmit = (e) => {

  }

  renderCategoryEditForm() {
    const {history, category, promotion, onCancel} = this.props
    switch (category.type) {
      case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_RECHARGE:
      {
        return (
          <RechargePromEditForm history={history} promotion={promotion} onSubmit={onCancel} />
        )
      }
      case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_SCORE:
      {
        return(
          <ScorePromotionEditForm history={history} promotion={promotion} onSubmit={onCancel} />
        )
      }
      case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_REDENVELOPE:
      {
        return(
          <RedEnvelopePromEditForm history={history} promotion={promotion} onSubmit={onCancel}/>
        )
      }
      case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_EXCHANGE_SCORE:
      {
        return(
          <ScoreExchangePromEditForm history={history} promotion={promotion} onSubmit={onCancel}/>
        )
      }
      default:
      {
        return null
      }
    }
  }

  render() {
    const {history, promotion, onCancel } = this.props
    if(promotion) {
      return (
        <Modal title="编辑活动"
               width={720}
               visible={true}
               onOk={this.onSubmit}
               onCancel={onCancel}
               footer={null}>
          {
            this.renderCategoryEditForm()
          }
        </Modal>
      )
    }
    return null
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

export default connect(mapStateToProps)(PromotionEditModal)
