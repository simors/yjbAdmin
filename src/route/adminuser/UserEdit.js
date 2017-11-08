import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button, Form, Input, Select, Checkbox, message} from 'antd';
import {action, selector} from './redux';
import {action as authAction, selector as authSelector} from '../../util/auth/';
import {stationAction} from '../station/';
import {ROLE_CODE} from '../../util/rolePermission/';
import style from './UserEdit.module.scss';

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

  validAdminHaveNoStation = (userId) => {
    return new Promise((resolve, reject) => {
      this.props.validAdminHaveNoStation({
        userId,
        success: () => {
          resolve();
        },
        error: () => {
          reject('取消用户服务点管理员角色，请先取消该用户与服务点的关联');
        }
      });
    });
  };

  validInvestorHaveNoStation = (userId) => {
    return new Promise((resolve, reject) => {
      this.props.validInvestorHaveNoStation({
        userId,
        success: () => {
          resolve();
        },
        error: () => {
          reject('取消用户服务点投资人角色，请先取消该用户与服务点的关联');
        }
      });
    });
  };

  validPartnerHaveNoStation = (userId) => {
    return new Promise((resolve, reject) => {
      this.props.validPartnerHaveNoStation({
        userId,
        success: () => {
          resolve();
        },
        error: () => {
          reject('取消用户服务单位角色，请先取消该用户与服务点的关联');
        }
      });
    });
  };

  onSubmit = (e) => {
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

      const {id: userId} = this.props.user;
      const {roles} = values;
      const newRoles = new Set(roles);
      const oldRoles = new Set(this.props.user.roles);
      const uncheckAdmin = !newRoles.has(ROLE_CODE.STATION_MANAGER) && oldRoles.has(ROLE_CODE.STATION_MANAGER);
      const uncheckInvestor = !newRoles.has(ROLE_CODE.STATION_INVESTOR) && oldRoles.has(ROLE_CODE.STATION_INVESTOR);
      const uncheckPartner = !newRoles.has(ROLE_CODE.STATION_PROVIDER) && oldRoles.has(ROLE_CODE.STATION_PROVIDER);

      Promise.resolve().then(
        () => {
          if (uncheckAdmin) {
            return this.validAdminHaveNoStation(userId);
          }
        }
      ).then(
        () => {
          if (uncheckInvestor) {
            return this.validInvestorHaveNoStation(userId);
          }
        }
      ).then(
        () => {
          if (uncheckPartner) {
            return this.validPartnerHaveNoStation(userId);
          }
        }
      ).then(
        () => {
          this.props.updateUser({
            params: {
              id: this.props.user.id,
              ...values,
            },
            onSuccess: () => {
              this.props.hideUserEditModal({});
              this.props.form.resetFields();
              this.props.listAdminUsers({limit: 1000, skipMyself: true,});
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
        },
        (err) => {
          message.error(err);
          this.setState((prevState, props) => {
            return {
              ...prevState,
              loading: false,
            };
          });
        }
      );
    });
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

    const roleOptions = [];
    this.props.allRoles.forEach((i) => {
      roleOptions.push({
        label: i.displayName,
        value: i.code
      })
    });

    if (this.props.user === undefined)
      return null;

    return (
      <Modal visible={this.props.visible}
             wrapClassName={style.UserEdit}
             title='修改用户信息'
             closable={false}
             footer={[
               <Button key='1' type='primary' onClick={this.onHideModal}>
                 关闭
               </Button>,
               <Button key='2' type='primary' onClick={this.onSubmit}
                       loading={this.state.loading}
               >
                 提交
               </Button>
             ]}>
        <Form>
          <Form.Item
            {...formItemLayout}
            label='用户名'
            hasFeedback
          > {
            getFieldDecorator('nickname', {
              initialValue: this.props.user.nickname,
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='手机号码'
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
            label='角色'
            hasFeedback
          > {
            getFieldDecorator('roles', {
              initialValue: this.props.user.roles,
              rules: [{
                required: true, message: '请选择角色!'
              }]
            })(
              <Checkbox.Group options={roleOptions} />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='备注'
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
  const allRoles = authSelector.selectRoles(appState);
  const visible = selector.selectUserEditModalVisible(appState);

  const userId = selector.selectCurOpUserId(appState);
  const user = authSelector.selectUserById(appState, userId);

  return {
    allRoles,
    visible,
    user,
  };
};

const mapDispatchToProps = {
  ...action,
  ...authAction,
  ...stationAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UserEdit));
