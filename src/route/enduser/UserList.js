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
        const updatedAtStr = moment(updatedAt).format('LLL');
        return (
          <span>
            {updatedAtStr}
          </span>
        );
      },
    }, {
      title: '状态',
      render: (record) => {
        const {mpStatus} = record;
        let statusStr = '正常';
        let color = 'inherit';
        if (mpStatus === AUTH_USER_STATUS.MP_DISABLED) {
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
              mpStatus: AUTH_USER_STATUS.MP_DISABLED,
            },
            onSuccess: () => {
              this.props.listEndUsers({
                limit: 1000,
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
              mpStatus: AUTH_USER_STATUS.MP_NORMAL,
            },
            onSuccess: () => {
              this.props.listEndUsers({
                limit: 1000,
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

        return (
          <span>
            {(() => {
              if (record.mpStatus === AUTH_USER_STATUS.MP_DISABLED) {
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
    this.props.listEndUsers({
      limit: 1000,
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

    if (selectedRowKeys.length === 1) {
    }
  };

  render() {
    const {loading} = this.props;
    if (this.props.users === undefined)
      return null;

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
  const users = authSelector.selectEndUsers(appState);

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
