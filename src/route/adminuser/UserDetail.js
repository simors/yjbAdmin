import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button, Form, Input, Select, Checkbox} from 'antd';
import moment from 'moment';
import {action, selector} from "./redux";
import {selector as authSelector} from "../../util/auth/";
import style from './UserDetail.module.scss';
import {AUTH_USER_STATUS} from "../../util/auth/redux";

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  onHideModal = () => {
    this.props.hideUserDetailModal();
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

    if (this.props.user === undefined)
      return null;

    const {status, createdAt, updatedAt} = this.props.user;

    let statusElem = (<span>正常</span>);
    if (this.props.user.status === AUTH_USER_STATUS.ADMIN_DISABLED) {
      statusElem = (<span style={{color: 'red'}}>禁用</span>);
    }

    const createdAtElem = (<span>{moment(createdAt).format('lll')}</span>);
    const updatedAtElem = (<span>{moment(updatedAt).format('lll')}</span>);

    return (
      <Modal visible={this.props.visible}
             wrapClassName={style.UserDetail}
             title='查看用户信息'
             closable={false}
             footer={[
               <Button key="1" type="primary" onClick={this.onHideModal}>
                 关闭
               </Button>
             ]}>
        <Form>
          <Form.Item
            {...formItemLayout}
            label='用户名'
          >
            <Input value={this.props.user.nickname} readOnly />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='手机号码'
          >
            <Input addonBefore={prefixSelector} style={{ width: '100%' }}
                   value={this.props.user.mobilePhoneNumber} readOnly />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='角色'
          >
            <Checkbox.Group options={roleOptions} value={this.props.user.roles} />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='备注'
          >
            <Input.TextArea autosize={{minRows: 2, maxRows: 4}}
                            value={this.props.user.note ? this.props.user.note : ''} readOnly />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='状态'
          >
            {statusElem}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='注册时间'
          >
            {createdAtElem}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='最近登录时间'
          >
            {updatedAtElem}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const allRoles = authSelector.selectRoles(appState);
  const visible = selector.selectUserDetailModalVisible(appState);

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
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UserDetail));
