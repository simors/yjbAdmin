/**
 * Created by lilu on 2017/10/15.
 */
/**
 * Created by lilu on 2017/9/19.
 */
import React from 'react';
import {Table} from 'antd';
import mathjs from 'mathjs'

const columnsDetail = [{
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
},{
  title:'开始日期',
  dataIndex: 'startDate',
},{
  title:'结束日期',
  dataIndex: 'endDate',
}];

const columns = [{
  title: "服务点名称",
  dataIndex: "station.name",
  render: (text,record)=>{
    return <div>{record.station?record.station.name:'全服务点'}</div>
  }
}, {
  title: "分成方信息",
  dataIndex: "user.nickname",
}, {
  title: "利润",
  dataIndex: "profit",
  render: (text,record)=>{
    return <div>{record.profit+'元'}</div>
  }
},{
  title:'开始日期',
  dataIndex: 'startDate',
},{
  title:'结束日期',
  dataIndex: 'endDate',
}];


const rowKey = (record) => {
  return record.id;
};


const PartnerAccountList = (props) => {
  // console.log('[DEBUG] ---> UserList props: ', props);
  let {stationAccounts,viewType} = props;
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
      <Table columns={viewType=='all'?columns:columnsDetail} dataSource={stationAccounts} rowKey={rowKey} />
    </div>
  );
};

export default PartnerAccountList;
