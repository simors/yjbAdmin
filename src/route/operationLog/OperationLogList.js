/**
 * Created by lilu on 2017/10/21.
 */

import React from 'react';
import {Table} from 'antd';
import mathjs from 'mathjs'


const columns = [{
  title: "用户名",
  dataIndex: "user.nickname",
}, {
  title: "操作",
  dataIndex: "operation",

}];


const rowKey = (record) => {
  return record.id;
};


const OperationLogList = (props) => {
  let {operationLogs} = props;
  if (operationLogs === null) {
    operationLogs = [];
  }
  return (
    <div>
      <Table columns={columns} dataSource={operationLogs} rowKey={rowKey} />
    </div>
  );
};

export default OperationLogList;
