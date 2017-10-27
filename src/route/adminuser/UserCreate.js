import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button, Form, Input, Select, Checkbox, message, Row, Col} from 'antd';
import {action, selector} from './redux';
import {action as authAction, selector as authSelector, AUTH_USER_TYPE, AUTH_USER_STATUS} from '../../util/auth/';
import * as errno from '../../errno';
import style from './UserCreate.module.scss';
import SmsInput from '../../component/SmsInput'
import {getAuthorizeURL} from '../../util/wxUtil'
import appConfig from '../../util/appConfig'
import QRCode from 'qrcode.react'

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};

let validPhone = ''

class UserCreate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false,
      loading: false,
      step: 1,
      title: '新增用户 —— 验证手机号',
    };
    this.addUserId = undefined
  }

  onHideModal = () => {
    this.props.hideUserCreateModal();
    this.props.form.resetFields();
    setTimeout(() => {
      this.setState((prevState, props) => {
        return {
          ...prevState,
          loading: false,
          step: 1,
          title: '新增用户 —— 验证手机号',
        };
      });
    }, 1000)
  };

  onUpdateUser(values) {
    this.props.updateUser({
      params: {
        ...values,
        id: this.addUserId,
        password: validPhone.slice(-6),
        type: AUTH_USER_TYPE.BOTH,
      },
      onSuccess: () => {
        this.props.hideUserCreateModal({});
        this.props.form.resetFields();
        setTimeout(() => {
          this.setState((prevState, props) => {
            return {
              ...prevState,
              loading: false,
              step: 1,
              title: '新增用户 —— 验证手机号',
            };
          });
        }, 1000)
        this.props.listAdminUsers({limit: 100});
      },
      onFailure: (code) => {
        message.error(`创建管理员用户失败,请重试, 错误：${code}`);
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
  }

  submitPersonalInfo = (e) => {
    e.preventDefault();
    let {currentUser} = this.props
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

      let {sysSmsCode} = values
      let sysValidParams = {
        success: ()=>{
          message.success('操作授权成功')
          this.onUpdateUser(values)
        },
        code: sysSmsCode,
        operator: currentUser.id,
        error: (e)=>{
          message.error('操作授权失败或保存用户失败，请重试')
          this.setState((prevState, props) => {
            return {
              ...prevState,
              loading: false,
            };
          });
        }
      }
      this.props.verifySysAuthCode(sysValidParams)
    });
  }

  onFetchUserByPhoneSuccess = (user) => {
    let {form} = this.props
    let phone = form.getFieldValue('mobilePhoneNumber')
    validPhone = phone
    let smsCode = form.getFieldValue('smsCode')

    let updatePayload = undefined
    if (user) {
      this.addUserId = user.objectId
      message.warn('电话号码已被现有用户占用，请确认手机号码输入正确或直接修改相关用户信息', 30)
      updatePayload = {
        success: ()=>{
          message.success('手机号验证成功')
          this.setState({
            step: 3,
            title: '新增用户 —— 完善用户信息',
          })
        },
        smsCode: smsCode,
        phone: phone,
        error: (e)=>{message.error('手机号验证失败，请确认手机号或验证码填写正确')}
      }
    } else {
      updatePayload = {
        success: ()=>{
          message.success('手机号验证成功')
          this.setState({
            step: 2,
            title: '新增用户 —— 关联公众号',
          })
        },
        smsCode: smsCode,
        phone: phone,
        error: (e)=>{message.error('手机号验证失败，请确认手机号或验证码填写正确')}
      }
    }
    this.props.verifySmsCode(updatePayload)
  }

  submitValidatePhone = (e) => {
    e.preventDefault();
    let {form} = this.props
    form.validateFields((errors) => {
      if (errors) {
        return
      }
      let phone = form.getFieldValue('mobilePhoneNumber')
      validPhone = phone
      let smsCode = form.getFieldValue('smsCode')

      let phoneParams = {
        phone: phone,
        onSuccess: this.onFetchUserByPhoneSuccess,
        onFailure: (errcode) => {
          message.error('查询电话号码出错')
        },
      }
      this.props.fetchUserByPhone(phoneParams)
    })
  }

  checkUserAuth = (e) => {
    e.preventDefault();
    let phoneParams = {
      phone: validPhone,
      onSuccess: (user) => {
        if (user) {
          this.addUserId = user.objectId
          this.setState({
            step: 3,
            title: '新增用户 —— 完善用户信息',
          })
        } else {
          message.warn('用户还没有在微信端授权，请指导用户完成授权操作')
        }
      },
      onFailure: (errcode) => {
        message.error('查询电话号码出错')
      },
    }
    this.props.fetchUserByPhone(phoneParams)
  }

  renderValidatePhone() {
    const {getFieldDecorator} = this.props.form;

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 60 }}>
        <Select.Option value='86'>+86</Select.Option>
      </Select>
    );

    return (
      <div>
        <Form>
          <Form.Item
            {...formItemLayout}
            label='手机号码'
            hasFeedback
          > {
            getFieldDecorator('mobilePhoneNumber', {
              rules: [{
                required: false, message: '请输入手机号码!'
              }, {
                pattern: /^1\d{10}$/, message: '无效的手机号码!'
              }],
            })(
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='验证码'
            hasFeedback
          >
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('smsCode', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '验证码未填写'
                    }
                  ]
                })(<Input />)}
              </Col>
              <Col span={8}>
                <SmsInput params={{mobilePhoneNumber: validPhone, name: '衣家宝', op: '新增后台用户'}}/>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    )
  }

  renderFocusMp() {
    let redirectUrl = appConfig.MP_SERVER_DOMAIN + '/wechatOauth/adminUserAuth/'
    let authUrl = getAuthorizeURL(redirectUrl, validPhone, 'snsapi_userinfo')
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <QRCode ref="qrcode" value={authUrl} size={200}/>
        <div style={{marginTop: 10, fontSize: 16, color: 'red', width: 300}}>
          使用待添加后台用户的微信扫描上方二维码，并关注衣家宝公众号完成绑定操作
        </div>
      </div>
    )
  }

  renderCompletePersonalInfo() {
    let {form, currentUser} = this.props
    const {getFieldDecorator} = form;

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

    let sysSmsInput = {
      adminUser: currentUser.id,
      opName: '新增后台用户',
    }
    return (
      <div>
        <Form>
          <Form.Item
            {...formItemLayout}
            label='用户名'
            hasFeedback
          > {
            getFieldDecorator('nickname', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='手机号码'
            hasFeedback
          > {
            getFieldDecorator('validMobilePhoneNumber', {
              rules: [{
                required: true, message: '请输入手机号码!'
              }, {
                pattern: /^1\d{10}$/, message: '无效的手机号码!'
              }],
              initialValue: validPhone
            },
            )(
              <Input addonBefore={prefixSelector} disabled={true} style={{ width: '100%' }} />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='角色'
            hasFeedback
          > {
            getFieldDecorator('roles', {
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

            })(
              <Input.TextArea autosize={{minRows: 2, maxRows: 4}} />
            )
          }
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='授权码'
            hasFeedback
          >
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('sysSmsCode', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '向系统管理员索要授权码'
                    }
                  ]
                })(<Input />)}
              </Col>
              <Col span={8}>
                <SmsInput getSmsAuthText="获取授权码" params={sysSmsInput}/>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    )
  }

  renderStepView() {
    switch (this.state.step) {
      case 1:
        return this.renderValidatePhone()
      case 2:
        return this.renderFocusMp()
      case 3:
        return this.renderCompletePersonalInfo()
    }
  }

  renderStepBtn() {
    switch (this.state.step) {
      case 1:
        return (
          <Button key='2' type='primary' onClick={this.submitValidatePhone}>
            下一步
          </Button>
        )
      case 2:
        return (
          <Button key='2' type='primary' onClick={this.checkUserAuth}>
            下一步
          </Button>
        )
      case 3:
        return (
          <Button key='2' type='primary' onClick={this.submitPersonalInfo}
                  loading={this.state.loading}
          >
            提交
          </Button>
        )
    }
  }

  render() {
    return (
      <Modal visible={this.props.visible}
             wrapClassName={style.UserCreate}
             title={this.state.title}
             closable={false}
             footer={[
               <Button key='1' type='primary' onClick={this.onHideModal}>
                 关闭
               </Button>,
               this.renderStepBtn()
             ]}>
        {this.renderStepView()}
      </Modal>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const allRoles = authSelector.selectRoles(appState);
  const visible = selector.selectUserCreateModalVisible(appState);

  let currentUser = authSelector.selectCurAdminUser(appState)
  return {
    allRoles,
    visible,
    currentUser: currentUser,
  }
};

const mapDispatchToProps = {
  ...action,
  ...authAction,
};

const UserCreateForm = Form.create({
  onFieldsChange(props, changedFields) {
    let {mobilePhoneNumber} = changedFields
    if (mobilePhoneNumber) {
      validPhone = mobilePhoneNumber.value
    }
  },
})(UserCreate)

export default connect(mapStateToProps, mapDispatchToProps)(UserCreateForm);
