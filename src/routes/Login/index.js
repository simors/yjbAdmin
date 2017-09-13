/**
 * Created by yangyang on 2017/9/4.
 */
import React from 'react'
import {fakeAuth} from '../../utils/auth'
import {Redirect} from 'react-router-dom'
import {Button, Row, Form, Input} from 'antd'
import './login.scss'

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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      fakeAuth.authenticate(() => {
        this.setState({ redirectToReferrer: true })
      })
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
      <div className="form">
        <div className="logo">
          <img src={require("../../asset/image/logo.jpg")}/>
          <span>绿蚁网络</span>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem hasFeedback>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请填写用户名'
                }
              ]
            })(<Input size='large' onPressEnter={this.handleSubmit} placeholder='用户名'/>)}
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
      </div>
    )
  }
}

const LoginForm = Form.create()(Login)

export default LoginForm