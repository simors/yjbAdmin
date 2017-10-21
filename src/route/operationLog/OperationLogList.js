/**
 * Created by lilu on 2017/10/21.
 */

import React from 'react';
import {Table} from 'antd';
import mathjs from 'mathjs'
import moment from 'moment'


const columns = [{
  title: "操作者",
  dataIndex: "user.nickname",
}, {
  title: "联系方式",
  dataIndex: "user.mobilePhoneNumber",
}, {
  title: "操作",
  dataIndex: "operation",
}, {
  title: "操作时间",
  dataIndex: "createdAt",
  render: (text,record)=>{return (
    <div>{moment(record.createdAt).format('YYYY-MM-DD hh:mm:ss')}</div>
  )}
}];


const rowKey = (record) => {
  return record.id;
};



const OperationLogList = (props) => {

  let {operationLogs,changePageSize} = props;
  let Pagination = {
    defaultPageSize: 2,
    onChange:(page, pageSize)=>{changePageSize(page, pageSize)}
  }
  if (operationLogs === null) {
    operationLogs = [];
  }
  return (
    <div>
      <Table columns={columns} pagination={Pagination} dataSource={operationLogs} rowKey={rowKey} />
    </div>
  );
};

export default OperationLogList;
