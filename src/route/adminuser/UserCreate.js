import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button, Form, Input, Select, Checkbox, message, Row, Col} from 'antd';
import {action, selector} from './redux';
import {action as authAction, selector as authSelector, AUTH_USER_TYPE} from '../../util/auth/';
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

  submitPersonalInfo() {
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

      console.log('values', values)

      const {mobilePhoneNumber} = values;
      // this.props.createUser({
      //   params: {
      //     ...values,
      //     password: mobilePhoneNumber.slice(-6),
      //     type: AUTH_USER_TYPE.ADMIN,
      //   },
      //   onSuccess: () => {
      //     this.props.hideUserCreateModal({});
      //     this.props.form.resetFields();
      //     this.props.listAdminUsers({limit: 100});
      //   },
      //   onFailure: (code) => {
      //     if (code === errno.EEXIST) {
      //       message.error('用户已存在');
      //     } else {
      //       message.error(`创建用户失败, 错误：${code}`);
      //     }
      //   },
      //   onComplete: () => {
      //     this.setState((prevState, props) => {
      //       return {
      //         ...prevState,
      //         loading: false,
      //       };
      //     });
      //   },
      // });
    });
  }

  submitValidatePhone() {
    let {form} = this.props
    form.validateFields((errors) => {
      if (errors) {
        return
      }
      let phone = form.getFieldValue('mobilePhoneNumber')
      validPhone = phone
      let smsCode = form.getFieldValue('smsCode')

      let payload = {
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
      this.props.verifySmsCode(payload)
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
    let step = this.state.step
    if (step == 1) {
      this.submitValidatePhone()
    } else if (step == 2) {
      this.setState({
        step: 3,
        title: '新增用户 —— 完善用户信息',
      })
    } else {
      this.submitPersonalInfo()
    }
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
    let redirectUrl = appConfig.MP_CLIENT_DOMAIN + '/authUser/' + validPhone
    let authUrl = getAuthorizeURL(redirectUrl, '', 'snsapi_userinfo')
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
    let {form} = this.props
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
               <Button key='2' type='primary' onClick={this.onSubmit}
                       loading={this.state.loading}
               >
                 {this.state.step != 3 ? '下一步' : '提交'}
               </Button>
             ]}>
        {this.renderStepView()}
      </Modal>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const allRoles = authSelector.selectRoles(appState);
  const visible = selector.selectUserCreateModalVisible(appState);

  return {
    allRoles,
    visible,
  };
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
