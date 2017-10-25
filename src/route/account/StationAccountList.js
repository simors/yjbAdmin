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
  render: (text,record)=>{return(
    <div>{record.station&&record.station.name?record.station.name:'全平台'}</div>
  )}
}, {
  title: "成本",
  dataIndex: "cost",

}, {
  title: "收益",
  dataIndex: "incoming",

}, {
  title: "利润",
  dataIndex: "profit",

}, {
  title: "平台利润",
  dataIndex: "platformProfit",
}, {
  title: "平台利润占比",
  dataIndex: "platformRoyalty",
  render: (text,record)=>{
    if(record.platformProfit&&record.profit){
      return <div>{mathjs.round(mathjs.chain(1).multiply(record.platformProfit/record.profit).multiply(100).done(),2)+'%'}</div>
    }else{
      return <div>0</div>
    }
  }
}, {
  title: "分成方利润",
  dataIndex: "partnerProfit",
}, {
  title: "分成方利润占比",
  dataIndex: "partnerRoyalty",
  render: (text,record)=>{
    if(record.partnerProfit&&record.profit){
      return <div>{mathjs.round(mathjs.chain(1).multiply(record.partnerProfit/record.profit).multiply(100).done(),2)+'%'}</div>
    }else{
      return <div>0</div>
    }
  }
}, {
  title: "投资人利润",
  dataIndex: "investorProfit",
}, {
  title: "投资人利润占比",
  dataIndex: "investorRoyalty",
  render: (text,record)=>{
    if(record.investorProfit&&record.profit){
      return <div>{mathjs.round(mathjs.chain(1).multiply(record.investorProfit/record.profit).multiply(100).done(),2)+'%'}</div>
    }else{
      return <div>0</div>
    }
  }
}, {
  title: "日期",
  dataIndex: "accountDay",
}];


const rowKey = (record) => {
  return record.id;
};


const StationAccountList = (props) => {
  // console.log('[DEBUG] ---> UserList props: ', props);
  let {stationAccounts} = props;
  if (stationAccounts === null) {
    stationAccounts = [];
  }
  let startDate = {
    title:'开始日期',
    dataIndex: 'startDate',
    render:(text,record)=>{return(<div>{record.startDate}</div>)}
  }
  let endDate = {
    title:'结束日期',
    dataIndex: 'endDate',
    render:(text,record)=>{return(<div>{record.endDate}</div>)}
  }

  if(stationAccounts&&stationAccounts[0]&&stationAccounts[0].startDate){
    columns.push(startDate)
  }
  if(stationAccounts&&stationAccounts[0]&&stationAccounts[0].endDate){
    columns.push(endDate)
  }

  return (
    <div>
      <Table columns={columns} dataSource={stationAccounts} rowKey={rowKey} />
    </div>
  );
};

export default StationAccountList;
