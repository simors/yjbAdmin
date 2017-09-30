/**
 * Created by wanpeng on 2017/9/25.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
  Modal,
} from 'antd'
import DeviceEditForm from './DeviceEditForm'


class DeviceEditModal extends PureComponent {
  constructor(props) {
    super(props)
  }

  onSubmit = (e) => {

  }

  render() {
    if(this.props.device) {
      return (
        <Modal title="编辑干衣柜"
               width={720}
               visible={this.props.visible}
               onOk={this.onSubmit}
               onCancel={this.props.onCancel}
               footer={null}>
          <DeviceEditForm device={this.props.device} onSubmit={this.props.onCancel} />
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

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceEditModal)
