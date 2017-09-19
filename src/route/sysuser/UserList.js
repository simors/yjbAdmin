import React from 'react';
import {Table} from 'antd';

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

export default UserList;
