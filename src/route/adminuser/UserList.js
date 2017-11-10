import React from 'react';
import {connect} from 'react-redux';
import {Table, Popconfirm, message} from 'antd';
import {action, selector} from './redux';
import {action as authAction, selector as authSelector, AUTH_USER_STATUS} from '../../util/auth/';

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [{
      title: "用户名",
      dataIndex: "nickname",
    }, {
      title: "手机号码",
      dataIndex: "mobilePhoneNumber",
    }, {
      title: '状态',
      key: 'status',
      render: (record) => {
        const {status} = record;

        return (
          <span>
            {(() => {
              if (status === AUTH_USER_STATUS.ADMIN_DISABLED) {
                return (<span style={{color: 'red'}}>禁用</span>);
              } else {
                return (<span>正常</span>);
              }
            })()}
          </span>
        );
      },
    }, {
      title: "备注",
      dataIndex: "note",
    }, {
      title: '操作',
      key: 'action',
      render: (record) => {
        return (
          <span>
            <a style={{color: 'blue'}}
               onClick={() => {
                 this.props.showUserDetailModal({curOpUserId: record.id});
               }}
            >
              详情
            </a>
            <span className="ant-divider" />
            <a style={{color: 'blue'}}
               onClick={() => {
                 this.props.showUserEditModal({curOpUserId: record.id});
               }}
            >
              编辑
            </a>
            <span className="ant-divider" />
            {(() => {
              const onDisable = () => {
                this.props.updateUser({
                  params: {
                    id: record.id,
                    status: AUTH_USER_STATUS.ADMIN_DISABLED,
                  },
                  onSuccess: () => {
                    this.props.listAdminUsers({
                      limit: 1000,
                      skipMyself: true,
                      onStart: () => {
                        this.props.changeLoading({loading: true});
                      },
                      onComplete: () => {
                        this.props.changeLoading({loading: false});
                      },
                    });
                  },
                  onFailure: (code) => {
                    message.error(`禁用用户失败, 错误：${code}`);
                  },
                });
              };

              const onEnable = () => {
                this.props.updateUser({
                  params: {
                    id: record.id,
                    status: AUTH_USER_STATUS.ADMIN_NORMAL,
                  },
                  onSuccess: () => {
                    this.props.listAdminUsers({
                      limit: 1000,
                      skipMyself: true,
                      onStart: () => {
                        this.props.changeLoading({loading: true});
                      },
                      onComplete: () => {
                        this.props.changeLoading({loading: false});
                      },
                    });
                  },
                  onFailure: (code) => {
                    message.error(`启用用户失败, 错误：${code}`);
                  },
                });
              };

              if (record.status === AUTH_USER_STATUS.ADMIN_DISABLED) {
                return (
                  <Popconfirm title='确定要启用该用户吗？' onConfirm={onEnable}>
                    <a style={{color: 'blue'}}>启用</a>
                  </Popconfirm>
                );
              } else {
                return (
                  <Popconfirm title='确定要禁用该用户吗？' onConfirm={onDisable}>
                    <a style={{color: 'blue'}}>禁用</a>
                  </Popconfirm>
                );
              }
            })()}
          </span>
        );
      },
    }];
  }

  componentDidMount() {
    this.props.listAdminUsers({
      limit: 1000,
      skipMyself: true,
      onStart: () => {
        this.props.changeLoading({loading: true});
      },
      onComplete: () => {
        this.props.changeLoading({loading: false});
      },
    });
  }

  rowKey = (record) => {
    return record.id;
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.updateSelectedUserIds({selected: selectedRowKeys});
  };

  render() {
    const {loading} = this.props;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.props.selectedUserIds,
      onChange: this.onSelectChange,
    };

    return (
      <Table
             columns={this.columns} dataSource={this.props.users}
             rowKey={this.rowKey} rowSelection={rowSelection}
             loading={loading}
      />
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const loading = selector.selectLoading(appState);
  const selectedUserIds = selector.selectSelectedUserIds(appState);
  const users = authSelector.selectAdminUsers(appState);

  return {
    loading,
    selectedUserIds,
    users,
  };
};

const mapDispatchToProps = {
  ...action,
  ...authAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
