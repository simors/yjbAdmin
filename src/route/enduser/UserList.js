import React from 'react';
import {connect} from 'react-redux';
import {Table, Popconfirm, message} from 'antd';
import moment from 'moment';
import {action, selector} from './redux';
import {action as authAction, selector as authSelector, AUTH_USER_STATUS} from '../../util/auth/';

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
        const {province={}, city={}} = record;
        const {label: provinceStr=''} = province;
        const {label: cityStr=''} = city;
        let area = provinceStr;
        if (cityStr) {
          area = `${provinceStr}/${cityStr}`;
        }
        return (
          <span>
            {area}
          </span>
        );
      },
    }, {
      title: '最近登录时间',
      render: (record) => {
        const {updatedAt} = record;
        const updatedAtStr = moment(updatedAt).format('lll');
        return (
          <span>
            {updatedAtStr}
          </span>
        );
      },
    }, {
      title: '状态',
      render: (record) => {
        const {status} = record;
        let statusStr = '正常';
        let color = 'inherit';
        if (status === AUTH_USER_STATUS.DISABLED) {
          statusStr = '禁用';
          color = 'red';
        }

        return (
          <span style={{color}}>{statusStr}</span>
        );
      },
    }, {
      title: '操作',
      key: 'action',
      render: (record) => {
        const onDisable = () => {
          this.props.updateUser({
            params: {
              id: record.id,
              status: AUTH_USER_STATUS.DISABLED,
            },
            onSuccess: () => {
              this.props.listEndUsers({limit: 100});
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
              status: AUTH_USER_STATUS.NORMAL,
            },
            onSuccess: () => {
              this.props.listEndUsers({limit: 100});
            },
            onFailure: (code) => {
              message.error(`启用用户失败, 错误：${code}`);
            },
          });
        };

        return (
          <span>
            {(() => {
              if (record.status === AUTH_USER_STATUS.DISABLED) {
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
    this.props.listEndUsers({limit: 100});
  }

  rowKey = (record) => {
    return record.id;
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.updateSelectedUserIds({selected: selectedRowKeys});

    if (selectedRowKeys.length === 1) {
    }
  };

  render() {
    if (this.props.users === undefined)
      return null;

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
