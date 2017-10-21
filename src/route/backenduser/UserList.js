import React from 'react';
import {connect} from 'react-redux';
import {Table} from 'antd';
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
               this.props.showUserDetailModal({record});
             }}>
            详情
          </a>
          <span className="ant-divider" />
          {(() => {
            if (record.status === 'disabled')
              return <a style={{color: 'blue'}}>启用</a>;
            else
              return <a style={{color: 'blue'}}>禁用</a>;
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

    if (selectedRowKeys.length === 1) {
      const roles = selectedRows[0].roles;
      this.props.updateCheckedUserRoles({checked: roles});
    }
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
