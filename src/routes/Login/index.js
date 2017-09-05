/**
 * Created by yangyang on 2017/9/4.
 */
import React from 'react'
import {Button, Row, Form, Input} from 'antd'
import styles from './login.scss'

const FormItem = Form.Item

class Login extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.form}>
        <div className={styles.logo}>
          <img src="../asset/image/logo.jpg"/>
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