import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button, Form, Input, Select, Checkbox} from 'antd';
import {action, selector} from './redux';
import {action as authAction} from '../../util/auth/';
import {selector as authSelector} from "../../util/auth/";
import style from './UserEdit.module.scss';

const kRoles = [
  {label: '平台管理员', value: 100},
  {label: '服务点管理员', value: 200},
  {label: '服务点投资人', value: 300},
  {label: '服务单位', value: 400}
];

class UserEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false,
      loading: false,
    };
  }

  onHideModal = () => {
    this.props.hideUserEditModal();
    this.props.form.resetFields();
    this.setState((prevState, props) => {
      return {
        ...prevState,
        loading: false,
      };
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      this.setState((prevState, props) => {
        return {
          ...prevState,
          loading: true,
        };
      });

      this.props.updateUser({
        params: {
          id: this.props.user.id,
          ...values,
          type: 'admin',
        },
        onSuccess: () => {
          this.props.hideUserEditModal({});
          this.props.form.resetFields();
          this.props.fetchUserList({});
        },
        onComplete: () => {
          this.setState((prevState, props) => {
            return {
              ...prevState,
              loading: false,
            };
          });
        },
      });
    });
  };

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
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
        <Select.Option value='86' disabled>+86</Select.Option>
      </Select>
    );

    const roles = [];
    // User.roles is type of List<Role>
    if (this.props.user && this.props.user.roles) {
      this.props.user.roles.toArray().forEach((i) => {
        roles.push(i.code);
      });
    }

    return (
      <Modal visible={this.props.visible}
             wrapClassName={style.UserEdit}
             title='修改用户信息'
             closable={false}
             footer={[
               <Button key='1' type='primary' onClick={this.onHideModal}>
                 关闭
               </Button>,
               <Button key='2' type='primary' onClick={this.handleSubmit}
                       loading={this.state.loading}
               >
                 提交
               </Button>
             ]}>
        <Form>
          <Form.Item
            {...formItemLayout}
            label='用户名'
          > {
            getFieldDecorator('idName', {
              initialValue: this.props.user.idName,
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='手机号'
          > {
            getFieldDecorator('mobilePhoneNumber', {
              initialValue: this.props.user.mobilePhoneNumber,
              rules: [{ required: true, message: '请输入手机号码!' }],
            })(
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} disabled />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='密码'
            hasFeedback
          > {
            getFieldDecorator('password', {
              rules: [{
                required: false, message: '请输入密码!',
              }, {
                validator: this.checkConfirm,
              }],
            })(
              <Input type='password' />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='确认密码'
            hasFeedback
          > {
            getFieldDecorator('confirm', {
              rules: [{
                required: false, message: '请确认密码!',
              }, {
                validator: this.checkPassword,
              }],
            })(
              <Input type='password' onBlur={this.handleConfirmBlur} />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='角色'
            hasFeedback
          > {

            getFieldDecorator('roles', {
              initialValue: roles,
              rules: [{
                required: true, message: '请选择角色!'
              }]
            })(
              <Checkbox.Group options={kRoles}>

              </Checkbox.Group>
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='备注'
            hasFeedback
          > {
            getFieldDecorator('note', {
              initialValue: this.props.user.note,
            })(
              <Input.TextArea autosize={{minRows: 2, maxRows: 4}} />
            )
          }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const visible = selector.selectUserEditModalVisible(appState);

  const selectedUserIds = selector.selectSelectedUserIds(appState);
  let user = {};
  if (selectedUserIds.length === 1) {
    const id = selectedUserIds[0];
    user = authSelector.selectUserById(appState, id);
  }

  return {
    visible,
    user,
  };
};

const mapDispatchToProps = {
  ...action,
  ...authAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UserEdit));
