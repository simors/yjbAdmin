/**
 * Created by lilu on 2017/9/19.
 */
import React from 'react';
import {Table} from 'antd';

const columns = [{
  title: "服务点名称",
  dataIndex: "name",
}, {
  title: "省",
  dataIndex: "province",
  render: (text, record)=> {
    return (<p>{record.province.label}</p>)
  }
}, {
  title: "市",
  dataIndex: "city",
  render: (text, record)=> {
    return (<p>{record.city.label}</p>)
  }
}, {
  title: "区",
  dataIndex: "area",
  render: (text, record)=> {
    return (<p>{record.area.label}</p>)
  }
}, {
  title: "服务点地址",
  dataIndex: "addr",
}, {
  title: "干衣柜数量",
  dataIndex: "deviceNo",
}, {
  title: "管理员",
  dataIndex: "adminName",
}, {
  title: "联系方式",
  dataIndex: "adminPhone",
}, {
  title: "状态",
  dataIndex: "status",
  render: (text, record)=> {
    return <p>{record.status ? '正常' : '已停用'}</p>
  }
}];


const rowKey = (record) => {
  return record.id;
};


const StationList = (props) => {
  // console.log('[DEBUG] ---> UserList props: ', props);
  let {stations, selectStation} = props;
  if (stations === null) {
    stations = [];
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
      <Table columns={columns} dataSource={stations} rowKey={rowKey} rowSelection={rowSelection}/>
    </div>
  );
};

export default StationList;
