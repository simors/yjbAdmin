/**
 * Created by lilu on 2017/9/21.
 */

import React from 'react';
import {Table} from 'antd';

const columns = [{
  title: "创建时间",
  dataIndex: "createdAt",
  render: (createdAt)=> {
    return <div>{createdAt.slice(0,10) }</div>
  }
}, {
  title: "姓名",
  dataIndex: "shareholder.nickname",
}, {
  title: "联系方式",
  dataIndex: "shareholder.mobilePhoneNumber",
}, {
  title: "投资服务点",
  dataIndex: "stationName",
}, {
  title: "投资金额",
  dataIndex: "investment",
}, {
  title: "投资占比",
  dataIndex: "royalty",
  render: (text, record)=> {
    return <p>{record.royalty * 100 + '%'}</p>
  }
}, {
  title: "状态",
  dataIndex: "status",
  render: (text, record)=> {
    return <div>{record.status ? '正常' : '已停用'}</div>
  }
}];


const rowKey = (record) => {
  return record.id;
};


const InvestorList = (props) => {
  // console.log('[DEBUG] ---> UserList props: ', props);
  let {investors, selectStation} = props;
  if (investors === null) {
    investors = [];
  }
  const rowSelection = {
    type: 'radio',
    onChange: (rowKey, rowData)=> {
      selectStation(rowKey, rowData)
    },
  };
  // console.log('[DEBUG] ---> UserList users: ', stations);

  return (
    <div>
      <Table columns={columns} dataSource={investors} rowKey={rowKey} rowSelection={rowSelection}/>
    </div>
  );
};

export default InvestorList;
