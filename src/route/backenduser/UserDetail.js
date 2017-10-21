import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button, Form, Input, Select, Checkbox} from 'antd';
import {action, selector} from "./redux";
import {selector as authSelector} from "../../util/auth/";
import style from './UserDetail.module.scss';

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  onHideModal = () => {
    this.props.hideUserDetailModal();
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    };

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 60 }}>
        <Select.Option value='86'>+86</Select.Option>
      </Select>
    );

    const roleOptions = [];
    this.props.allRoles.forEach((i) => {
      roleOptions.push({
        label: i.displayName,
        value: i.code
      })
    });

    return (
      <Modal visible={this.props.visible}
             wrapClassName={style.UserDetail}
             title='查看用户信息'
             closable={false}
             footer={[
               <Button key="1" type="primary" onClick={this.onHideModal}>
                 关闭
               </Button>
             ]}>
        <Form>
          <Form.Item
            {...formItemLayout}
            label='姓名'
          > {
            getFieldDecorator('idName', {
              initialValue: this.props.user.idName,
            })(
              <Input disabled />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='手机号码'
          > {
            getFieldDecorator('mobilePhoneNumber', {
              initialValue: this.props.user.mobilePhoneNumber,
            })(
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} disabled />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='角色'
          > {
            getFieldDecorator('roles', {
              initialValue: this.props.user.roles,
             })(
              <Checkbox.Group options={roleOptions} disabled />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='备注'
          > {
            getFieldDecorator('note', {
              initialValue: this.props.user.note ? this.props.user.note : '',
            })(
              <Input.TextArea autosize={{minRows: 2, maxRows: 4}} disabled />
            )
          }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const allRoles = authSelector.selectRoles(appState);
  const visible = selector.selectUserDetailModalVisible(appState);

  const selectedUserIds = selector.selectSelectedUserIds(appState);
  let user = {};
  if (selectedUserIds.length === 1) {
    const id = selectedUserIds[0];
    user = authSelector.selectUserById(appState, id);
  }

  return {
    allRoles,
    visible,
    user,
  };
};

const mapDispatchToProps = {
  ...action,
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UserDetail));
