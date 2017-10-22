import React from 'react';
import {connect} from 'react-redux';
import {Table, Popconfirm, message} from 'antd';
import {action, selector} from './redux';
import {action as authAction, selector as authSelector} from '../../util/auth/';

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
        return (
          <span>
            {(() => {
              if (record.status === 'disabled') {
                return ('禁用');
              } else {
                return ('正常');
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
                  status: 'disabled',
                },
                onSuccess: () => {
                  this.props.listAdminUsers({limit: 100});
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
                  status: '',
                },
                onSuccess: () => {
                  this.props.listAdminUsers({limit: 100});
                },
                onFailure: (code) => {
                  message.error(`启用用户失败, 错误：${code}`);
                },
              });
            };

            if (record.status === 'disabled') {
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
    this.props.listAdminUsers({limit: 100});
  }

  rowKey = (record) => {
    return record.id;
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.updateSelectedUserIds({selected: selectedRowKeys});
  };

  render() {
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.props.selectedUserIds,
      onChange: this.onSelectChange,
    };

    return (
      <div>
        <Table
               columns={this.columns} dataSource={this.props.users}
               rowKey={this.rowKey} rowSelection={rowSelection}
        />
      </div>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const selectedUserIds = selector.selectSelectedUserIds(appState);
  const users = authSelector.selectAdminUsers(appState);

  return {
    selectedUserIds,
    users,
  };
};

const mapDispatchToProps = {
  ...action,
  ...authAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
