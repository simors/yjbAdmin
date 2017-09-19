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

const rowSelection = {
  type: 'radio',
};

const rowKey = (record) => {
  return record.id;
};

const UserList = (props) => {
  console.log('[DEBUG] ---> UserList props: ', props);
  let {users} = props;
  if (users === null) {
    users = [];
  }

  console.log('[DEBUG] ---> UserList users: ', users);

  return (
    <div>
      <Table columns={columns} dataSource={users} rowKey={rowKey} rowSelection={rowSelection} />
    </div>
  );
};

export default UserList;
