import React from 'react';
import {Table} from 'antd';
import {List} from 'immutable';
import SearchBox from './SearchBox';

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

const SysUserList = (props) => {
  console.log('[DEBUG] ---> SysUserList props: ', props);
  let {users} = props;
  if (users === null) {
    users = [];
  }

  console.log('[DEBUG] ---> SysUserList users: ', users);

  return (
    <div>
      <SearchBox />
      <Table columns={columns} dataSource={users} rowKey={rowKey} rowSelection={rowSelection} />
    </div>
  );
};

export default SysUserList;
