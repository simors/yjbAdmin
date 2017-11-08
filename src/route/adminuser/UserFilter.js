import React from 'react';
import {connect} from 'react-redux';
import {Form, Input, Button, Select} from 'antd';
import {action, selector} from './redux';
import {action as authAction, AUTH_USER_STATUS} from '../../util/auth/';
import style from './UserFilter.module.scss';

class UserFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobilePhoneNumber: {
        hasFeedback: false,
        validateStatus: undefined,
        valid: true,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const {form, needResetFilter} = nextProps;

    if (this.props.needResetFilter !== needResetFilter) {
      form.resetFields();
      this.setState((prevState, props) => {
        return {
          ...prevState,
          mobilePhoneNumber: {
            hasFeedback: false,
            validateStatus: 'success',
            valid: true,
          },
        };
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const {valid: mobilePhoneNumberValid} = this.state.mobilePhoneNumber;
      if (!mobilePhoneNumberValid) {
        return;
      }

      const {nickname, mobilePhoneNumber, status} = values;
      this.props.listAdminUsers({
        limit: 1000,
        nickname,
        mobilePhoneNumber,
        status: status && parseInt(status),
        skipMyself: true,
      });
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    const validateMobilePhoneNumber = (rule, value, callback) => {
      let hasFeedback = false;
      let validateStatus = undefined;
      let valid = true;

      if (value) {
        const reMobilePhoneNumber = /^1\d{10}$/;
        if (!reMobilePhoneNumber.test(value)) {
          hasFeedback = true;
          validateStatus = 'error';
          valid = false;
        }
      }

      this.setState((prevState, props) => {
        return {
          ...prevState,
          mobilePhoneNumber: {
            hasFeedback,
            validateStatus,
            valid,
          },
        };
      });

      callback();
    };

    return (
      <Form layout="inline" onSubmit={this.handleSubmit} className={style.UserFilter}>
        <Form.Item className={style.nickname}>
          {getFieldDecorator('nickname', {})(
            <Input placeholder="用户名" />
          )}
        </Form.Item>
        <Form.Item className={style.mobilePhoneNumber}
                   hasFeedback={this.state.mobilePhoneNumber.hasFeedback}
                   validateStatus={this.state.mobilePhoneNumber.validateStatus}
        >
          {getFieldDecorator('mobilePhoneNumber', {
            rules: [{
              validator: validateMobilePhoneNumber,
            },]
          })(
            <Input placeholder="手机号码"/>
          )}
        </Form.Item>
        <Form.Item className={style.status}>
          {getFieldDecorator("status", {})(
            <Select placeholder="选择状态">
              <Select.Option value={AUTH_USER_STATUS.ADMIN_ALL.toString()}>全部</Select.Option>
              <Select.Option value={AUTH_USER_STATUS.ADMIN_NORMAL.toString()}>正常</Select.Option>
              <Select.Option value={AUTH_USER_STATUS.ADMIN_DISABLED.toString()}>禁用</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          <Button.Group>
            <Button
              onClick={() => {
                this.props.form.resetFields();
                this.setState((prevState, props) => {
                  return {
                    ...prevState,
                    mobilePhoneNumber: {
                      hasFeedback: false,
                      validateStatus: 'success',
                      valid: true,
                    },
                  };
                });
              }}
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

const mapStateToProps = (appState, ownProps) => {
  const needResetFilter = selector.selectNeedResetFilter(appState);

  return {
    needResetFilter,
  };
};

const mapDispatchToProps = {
  ...action,
  ...authAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UserFilter));
