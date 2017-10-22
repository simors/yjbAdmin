import React from 'react';
import {connect} from 'react-redux';
import {Table} from 'antd';
import {action, selector} from './redux';
import {action as authAction, selector as authSelector} from '../../util/auth/';

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [{
      title: '用户名',
      dataIndex: 'nickname',
    }, {
      title: '手机号码',
      dataIndex: 'mobilePhoneNumber',
    }, {
      title: '所在地区',
      render: (record) => {
        return (
          null
        );
      },
    }, {
      title: '最近登录时间',
      render: (record) => {
        return (
          null
        );
      },
    }, {
      title: '状态',
      render: (record) => {
        return (
          null
        );
      },
    }];
  }

  componentDidMount() {
    this.props.listEndUsers({limit: 100});
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
        <Table size="small" bordered
               columns={this.columns} dataSource={this.props.users}
               rowKey={this.rowKey} rowSelection={rowSelection}
        />
      </div>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const selectedUserIds = selector.selectSelectedUserIds(appState);
  const users = authSelector.selectEndUsers(appState);

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
