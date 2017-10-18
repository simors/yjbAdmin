/**
 * Created by wanpeng on 2017/10/17.
 */
import React, {PureComponent} from 'react'
import {
  Modal,
} from 'antd'
import RechargePromEditForm from './RechargePromEditForm'

class PromotionEditModal extends PureComponent {
  constructor(props) {
    super(props)
  }

  onSubmit = (e) => {

  }

  render() {
    const {history, promotion, visible, onCancel } = this.props
    if(promotion) {
      return (
        <Modal title="编辑活动"
               width={720}
               visible={visible}
               onOk={this.onSubmit}
               onCancel={onCancel}
               footer={null}>
          <RechargePromEditForm history={history} promotion={promotion} onSubmit={onCancel} />
        </Modal>
      )
    }
    return null
  }
}

export default PromotionEditModal
