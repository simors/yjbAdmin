import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Modal, Button, Form, Input, message, Row, Col} from 'antd';
import {action, selector} from './redux';
import {action as authAction, selector as authSelector} from '../../util/auth/';
import SmsInput from '../../component/smsModal/SmsInput';
import style from './Password.module.scss';

class Password extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false,
      loading: false,
    };
  }

  onHideModal = () => {
    this.props.hidePasswordModal({});
    this.props.form.resetFields();
    this.setState((prevState, props) => {
      return {
        ...prevState,
        loading: false,
      };
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

      const {smsCode, password} = values;
      const {mobilePhoneNumber} = this.props.curUser;

      const verifyPayload = {
        smsCode: smsCode,
        phone: mobilePhoneNumber,

        success: () => {
          this.props.updateUser({
            params: {
              id: this.props.curUser.id,
              password,
            },
            onSuccess: () => {
              message.success('修改密码成功，请重新登录');
              this.props.hidePasswordModal({});
              this.props.form.resetFields();
              this.props.logout({
                onComplete: () => {
                  this.props.history.push('/login');
                }
              });
            },
            onFailure: () => {
              message.success('修改密码失败，请重试');
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
        error: (e) => {
          message.error('验证失败，请确认验证码填写正确');
          this.setState((prevState, props) => {
            return {
              ...prevState,
              loading: false,
            };
          });
        }
      };

      this.props.verifySmsCode(verifyPayload)
    });
  };

  onConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validatePassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  };

  validateConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {curUser} = this.props;

    if (!curUser) {
      return null;
    }

    const {mobilePhoneNumber} = curUser;

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    };

    return (
      <Modal visible={this.props.visible}
             wrapClassName={style.Password}
             title='修改密码'
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
            label='短信验证码'
            hasFeedback
          >
            <Row gutter={8}>
              <Col span={13}>
                {getFieldDecorator('smsCode', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请输入短信验证码!'
                    }
                  ]
                })(<Input />)}
              </Col>
              <Col span={8}>
                <SmsInput params={{mobilePhoneNumber, name: '衣家宝', op: '修改登录密码'}}/>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='新密码'
            hasFeedback
          > {
            getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码!',
              }, {
                validator: this.validateConfirm,
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
                required: true, message: '请确认密码!',
              }, {
                validator: this.validatePassword,
              }],
            })(
              <Input type='password' onBlur={this.onConfirmBlur} />
            )
          }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const curUser = authSelector.selectCurUser(appState);
  const visible = selector.selectPasswordModalVisible(appState);

  return {
    curUser,
    visible,
  };
};

const mapDispatchToProps = {
  ...action,
  ...authAction,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(Password)));
