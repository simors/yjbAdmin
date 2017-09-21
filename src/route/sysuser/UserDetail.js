import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button, Form, Input} from 'antd';
import {sagaAction, selector} from "./redux";

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 12
  }
};

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  onClose = () => {
    this.props.UserDetail_close();
  };

  render() {
    console.log('[DEBUG] ---> UserDetail render, props: ', this.props);
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal visible={this.props.visible}
             title="用户信息"
             onCancel={this.onClose}
             footer={[
               <Button key="1" type="primary" onClick={this.onClose}>
                 关闭
               </Button>
             ]}>
        <Form>
          <Form.Item
            {...formItemLayout}
            label="姓名"
          > {
            getFieldDecorator('username', {
              initialValue: this.props.data.name,
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="密码"
          > {
            getFieldDecorator('password', {
              initialValue: this.props.data.password,
            })(
              <Input disabled />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="手机号码"
          > {
            getFieldDecorator('username', {
              initialValue: this.props.data.phoneNo,
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="备注"
          > {
            getFieldDecorator('note', {
              initialValue: this.props.data.note ? this.props.data.note : "暂无",
            })(
              <Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} disabled />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
    visible: selector.UserDetail.visible(appState),
    data: selector.UserDetail.data(appState),
  };
};

const mapDispatchToProps = {
  ...sagaAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UserDetail));
