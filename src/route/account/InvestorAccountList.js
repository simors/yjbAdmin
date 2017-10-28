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
  title: "投资人信息",
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
  title: "投资人信息",
  dataIndex: "user.nickname",
}, {
  title: "利润",
  dataIndex: "profit",
  render: (text,record)=>{
    return <div>{record.profit+'元'}</div>
  }

}, {
  title:'开始日期',
  dataIndex: 'startDate',
},{
  title:'结束日期',
  dataIndex: 'endDate',
}];


const rowKey = (record) => {
  return record.id;
};


const InvestorAccountList = (props) => {
  // console.log('[DEBUG] ---> UserList props: ', props);
  let {investorAccounts, viewType} = props;
  if (investorAccounts === null) {
    investorAccounts = [];
  }
  // console.log('investorAccounts===========>',investorAccounts)
  // let startDate = {
  //   title:'开始日期',
  //   dataIndex: 'startDate',
  //   render:(text,record)=>{return(<div>{record.startDate}</div>)}
  // }
  // let endDate = {
  //   title:'结束日期',
  //   dataIndex: 'endDate',
  //   render:(text,record)=>{return(<div>{record.endDate}</div>)}
  // }
  //
  // if(investorAccounts&&investorAccounts[0]&&investorAccounts[0].startDate){
  //   columns.push(startDate)
  // }
  // if(investorAccounts&&investorAccounts[0]&&investorAccounts[0].endDate){
  //   columns.push(endDate)
  // }

  return (
    <div>
      <Table columns={viewType=='all'?columns:columnsDetail} dataSource={investorAccounts} rowKey={rowKey} />
    </div>
  );
};

export default InvestorAccountList;
