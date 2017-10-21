/**
 * Created by yangyang on 2017/9/4.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {Button, Row, Form, Input, message} from 'antd'
import {action as authAction} from '../../util/auth/'
import style from './style.module.scss'
import LoadActivity, {loadAction} from '../../component/loadActivity'

const FormItem = Form.Item

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      redirectToReferrer: false
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.updateLoadingState({isLoading: true})
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      } else {
        return;
      }

      const {phone, password} = values;

      this.props.loginWithMobilePhone({
        phone,
        password,
        onSuccess: () => {
          this.setState({ redirectToReferrer: true });
          this.props.updateLoadingState({isLoading: false})
        },
        onFailure: (code) => {
          message.error(`登录失败, 错误：${code}`);
          this.props.updateLoadingState({isLoading: false})
        },
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div className={style.form}>
        <div className={style.logo}>
          <img src={require("../../asset/image/logo.png")}/>
          <span>衣家宝管理平台</span>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem hasFeedback>
            {getFieldDecorator('phone', {
              rules: [
                {
                  required: true,
                  message: '请填写手机号'
                }
              ]
            })(<Input size='large' onPressEnter={this.handleSubmit} placeholder='手机号'/>)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请填写密码'
                }
              ]
            })(<Input size='large' type='password' onPressEnter={this.handleSubmit} placeholder='密码'/>)}
          </FormItem>
          <Row>
            <Button type='primary' size='large' onClick={this.handleSubmit}>
              登录
            </Button>
          </Row>
        </Form>
          <LoadActivity tip="正在登录..."/>
      </div>
    )
  }
}

const mapDispatchToProps = {
  loginWithMobilePhone: authAction.loginWithMobilePhone,
  ...loadAction,
};

const LoginForm = connect(null, mapDispatchToProps)(Form.create()(Login));

export default LoginForm
