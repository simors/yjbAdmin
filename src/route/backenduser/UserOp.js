import React from 'react';
import {connect} from 'react-redux';
import {Button, Modal} from 'antd';
import {action, selector} from './redux';
import {action as authAction} from '../../util/auth';
import style from './UserOp.module.scss';

class UserOp extends React.Component {
  constructor(props) {
    super(props);
  }

  onDetail = () => {
    this.props.showUserDetailModal({});
  };

  onCreate = () => {
    this.props.showUserCreateModal({});
  };

  onEdit = () => {
    this.props.showUserEditModal({});
  };

  onDelete = () => {
    Modal.confirm({
      title: '确定要删除该用户吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        if (this.props.selectedUserIds.length !== 1)
            return;

        const id = this.props.selectedUserIds[0];
        this.props.deleteUser({
          params: {
            id
          },
          onSuccess: () => {
            this.props.listUsers({});
          }
        });
      },
      onCancel: () => {
      },
    });
  };

  onRefresh = () => {
    this.props.listAdminUsers({limit: 100});
  };

  render() {
    return (
      <div className={style.UserOp}>
        <Button.Group>
          <Button icon="info-circle-o"
                  disabled={this.props.selectedUserIds.length !== 1}
                  onClick={this.onDetail}>
            查看
          </Button>
          <Button icon="plus-circle-o"
                  onClick={this.onCreate}>
            新增
          </Button>
          <Button icon="edit"
                  disabled={this.props.selectedUserIds.length !== 1}
                  onClick={this.onEdit}>
            编辑
          </Button>
          <Button type="danger"
                  icon="minus-circle-o"
                  disabled={this.props.selectedUserIds.length < 1}
                  onClick={this.onDelete}>
            删除
          </Button>
          <Button icon="reload"
                  onClick={this.onRefresh}>
            刷新
          </Button>
        </Button.Group>
      </div>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const selectedUserIds = selector.selectSelectedUserIds(appState);
  const checkedUserRoles = selector.selectCheckedUserRoles(appState);

  return {
    selectedUserIds,
    checkedUserRoles,
  };
};

const mapDispatchToProps = {
  ...action,
  ...authAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserOp);
