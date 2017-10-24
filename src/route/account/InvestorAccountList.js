/**
 * Created by lilu on 2017/10/15.
 */
/**
 * Created by lilu on 2017/9/19.
 */
import React from 'react';
import {Table} from 'antd';
import mathjs from 'mathjs'


const columns = [{
  title: "服务点名称",
  dataIndex: "station.name",
}, {
  title: "分成方信息",
  dataIndex: "user.nickname",
}, {
  title: "利润",
  dataIndex: "profit",
  render: (text,record)=>{
    return <div>{record.profit+'元'}</div>
  }

}, {
  title: "日期",
  dataIndex: "accountDay",
}];


const rowKey = (record) => {
  return record.id;
};


const InvestorAccountList = (props) => {
  // console.log('[DEBUG] ---> UserList props: ', props);
  let {stationAccounts} = props;
  if (stationAccounts === null) {
    stationAccounts = [];
  }
  // const rowSelection = {
  //   type: 'radio',
  //   onChange: (rowKey, rowData)=> {
  //     selectStation(rowKey, rowData)
  //   },
  // };
  // console.log('[DEBUG] ---> UserList users: ', stations);

  return (
    <div>
      <Table columns={columns} dataSource={stationAccounts} rowKey={rowKey} />
    </div>
  );
};

export default InvestorAccountList;
