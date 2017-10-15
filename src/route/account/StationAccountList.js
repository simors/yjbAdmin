/**
 * Created by lilu on 2017/10/15.
 */
/**
 * Created by lilu on 2017/9/19.
 */
import React from 'react';
import {Table} from 'antd';

const columns = [{
  title: "服务点名称",
  dataIndex: "name",
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
  title: "分成方利润",
  dataIndex: "partnerProfit",
}, {
  title: "投资人利润",
  dataIndex: "investorProfit",
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

export default StationAccountList;
