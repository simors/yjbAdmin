/**
 * Created by wanpeng on 2017/9/25.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
  Button,
  Table,
  Row,
  Col,
  Input,
  Form,
  Select,
  Modal,
  Radio,
  message,
} from 'antd'
import style from './cabinet.module.scss'
import CabinetEditForm from './CabinetEditForm'
const FormItem = Form.Item


class CabinetEditModal extends PureComponent {
  constructor(props) {
    super(props)
  }

  onSubmit = (e) => {

  }

  render() {
    if(this.props.cabinet) {
      return (
        <Modal title="编辑干衣柜"
               width={720}
               visible={this.props.visible}
               onOk={this.onSubmit}
               onCancel={this.props.onCancel}
               footer={null}>
          <CabinetEditForm cabinet={this.props.cabinet} onSubmit={this.props.onCancel} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CabinetEditModal)
