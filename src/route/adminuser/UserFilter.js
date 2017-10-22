import React from 'react';
import {connect} from 'react-redux';
import {Form, Input, Button, Icon} from 'antd';
import {action} from './redux';
import {action as authAction} from '../../util/auth/';
import style from './UserFilter.module.scss';

class UserFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const {nickname, mobilePhoneNumber} = values;
      this.props.listAdminUsers({
        nickname,
        mobilePhoneNumber,
        limit: 100
      });
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit} className={style.UserFilter}>
        <Form.Item className={style.nickname}>
          {getFieldDecorator('nickname', {})(
            <Input placeholder="用户名" />
          )}
        </Form.Item>
        <Form.Item className={style.mobilePhoneNumber}>
          {getFieldDecorator('mobilePhoneNumber', {})(
            <Input placeholder="手机号码" />
          )}
        </Form.Item>
        <Form.Item>
          <Button.Group>
            <Button
              onClick={() => {this.props.form.resetFields()}}
            >
              重置
            </Button>
            <Button
              type='primary'
              htmlType='submit'
            >
              查询
            </Button>
          </Button.Group>
        </Form.Item>
      </Form>
    );
  }
}

const mapDispatchToProps = {
  ...action,
  ...authAction,
};

export default connect(null, mapDispatchToProps)(Form.create()(UserFilter));
