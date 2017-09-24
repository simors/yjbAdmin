import React from 'react';
import {connect} from 'react-redux';
import {Table} from 'antd';
import {sagaAction, selector} from './redux';

const columns = [{
  title: "姓名",
  dataIndex: "name",
}, {
  title: "手机号码",
  dataIndex: "phoneNo",
}, {
  title: "备注",
  dataIndex: "note",
}];

const rowKey = (record) => {
  return record.id;
};

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.rowSelection = {
      type: 'radio',
      onSelect: this.props.onUserChange
    };
  }

  componentDidMount() {
    this.props.sagaUserListDataGet();
  }

  render() {
    console.log('[DEBUG] ---> UserList render, props: ', this.props);
    let {users} = this.props;
    return (
      <div>
        <Table size="small" bordered
               columns={columns} dataSource={users}
               rowKey={rowKey} rowSelection={this.rowSelection}
        />
      </div>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
    ids: selector.UserList.ids(appState),
    users: selector.UserList.users(appState),
  };
};

const mapDispatchToProps = {
  ...sagaAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
