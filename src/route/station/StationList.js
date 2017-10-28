/**
 * Created by lilu on 2017/9/19.
 */
import React from 'react';
import {Table, Button} from 'antd';
import moment from 'moment'

const columns = [{
  title: "服务点名称",
  dataIndex: "name",
}, {
  title: "省",
  dataIndex: "province",
  render: (text, record)=> {
    return (<div>{record.province?record.province.label:''}</div>)
  }
}, {
  title: "市",
  dataIndex: "city",
  render: (text, record)=> {
    return (<div>{record.city?record.city.label:''}</div>)
  }
}, {
  title: "区",
  dataIndex: "area",
  render: (text, record)=> {
    return (<div>{record.area?record.area.label:''}</div>)
  }
}, {
  title: "服务点地址",
  dataIndex: "addr",
}, {
  title: "干衣柜数量",
  dataIndex: "deviceNo",
}, {
  title: "管理员",
  dataIndex: "admin.nickname",
}, {
  title: "联系方式",
  dataIndex: "admin.mobilePhoneNumber",
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


const StationList = (props) => {
  // console.log('[DEBUG] ---> UserList props: ', props);
  let {stations, selectStation,setStationStatus,editStation,showStation} = props;
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

  const columns = [{
    title: "服务点名称",
    dataIndex: "name",
  }, {
    title: "省",
    dataIndex: "province",
    render: (text, record)=> {
      return (<div>{record.province?record.province.label:''}</div>)
    }
  }, {
    title: "市",
    dataIndex: "city",
    render: (text, record)=> {
      return (<div>{record.city?record.city.label:''}</div>)
    }
  }, {
    title: "区",
    dataIndex: "area",
    render: (text, record)=> {
      return (<div>{record.area?record.area.label:''}</div>)
    }
  }, {
    title: "服务点地址",
    dataIndex: "addr",
  }, {
    title: "干衣柜数量",
    dataIndex: "deviceNo",
  }, {
    title: "管理员",
    dataIndex: "admin.nickname",
  }, {
    title: "联系方式",
    dataIndex: "admin.mobilePhoneNumber",
  }, {
    title: "状态",
    dataIndex: "status",
    render: (text, record)=> {
      return <div>{record.status ? '正常' : '已停用'}</div>
    }
  }, {
    title: '操作',
    render: (text, record)=> {
      return (
        <span>
          <a style={{color: `blue`}} onClick={()=> {
            showStation(record)
          }}>查看</a>
                    <span className="ant-divider" />

          <a style={{color: `blue`}} onClick={()=> {
            editStation(record)
          }}>编辑</a>
                    <span className="ant-divider" />

          {record.status?<a style={{color: `blue`}} onClick={()=> {
            setStationStatus(record)
          }}>停用</a>:<a style={{color: `blue`}} onClick={()=> {
            setStationStatus(record)
          }}>启用</a>}
        </span>
      )
    }
  }];

  return (
    <div>
      <Table columns={columns} dataSource={stations} rowKey={rowKey} />
    </div>
  );
};

export default StationList;
