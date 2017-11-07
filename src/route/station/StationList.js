/**
 * Created by lilu on 2017/9/19.
 */
import React from 'react';
import {Table, Button, Popconfirm} from 'antd';
import {connect} from 'react-redux';
import {selector} from '../../util/auth'
import {PERMISSION_CODE} from '../../util/rolePermission'

// const columns = [{
//   title: "服务点名称",
//   dataIndex: "name",
// }, {
//   title: "省",
//   dataIndex: "province",
//   render: (text, record)=> {
//     return (<div>{record.province?record.province.label:''}</div>)
//   }
// }, {
//   title: "市",
//   dataIndex: "city",
//   render: (text, record)=> {
//     return (<div>{record.city?record.city.label:''}</div>)
//   }
// }, {
//   title: "区",
//   dataIndex: "area",
//   render: (text, record)=> {
//     return (<div>{record.area?record.area.label:''}</div>)
//   }
// }, {
//   title: "服务点地址",
//   dataIndex: "addr",
// }, {
//   title: "干衣柜数量",
//   dataIndex: "deviceNo",
// }, {
//   title: "管理员",
//   dataIndex: "admin.nickname",
// }, {
//   title: "联系方式",
//   dataIndex: "admin.mobilePhoneNumber",
// }, {
//   title: "状态",
//   dataIndex: "status",
//   render: (text, record)=> {
//     return <div>{record.status ? '正常' : '已停用'}</div>
//   }
// }];


const rowKey = (record) => {
  return record.id;
};


const StationList = (props) => {
  let {stations, selectStation, setStationStatus, editStation, showStation, showVisible, editVisible, changeStatusVisible} = props;
  if (stations === null) {
    stations = [];
  }

  const renderOperationBtn = (text, record) => {
    let items = []
    if (showVisible) {
      items.push(<a key='a' style={{color: `blue`}} onClick={()=> {
        showStation(record)
      }}>查看</a>)
      items.push(<span key='b' className="ant-divider"/>)
    }
    if (editVisible) {
      items.push(<a key='c' style={{color: `blue`}} onClick={()=> {
        editStation(record)
      }}>编辑</a>)
      items.push(<span key='d' className="ant-divider"/>)
    }
    if (changeStatusVisible) {
      let changeBtn = (
        record.status ?
          <Popconfirm key='e' title="是否确认停用该服务点" onConfirm={()=> {
            setStationStatus(record)
          }}>
            <a style={{color: `blue`}}>停用</a>
          </Popconfirm>
          :
          <Popconfirm key='f' title="是否确认启用该服务点" onConfirm={()=> {
            setStationStatus(record)
          }}>
            <a style={{color: `blue`}}>启用</a>
          </Popconfirm>
      )
      items.push(changeBtn)
      items.push(<span key='g' className="ant-divider"/>)
    }
    if (items.length >= 2) {
      items.pop()
    }
    return (
      <span key='h'>
        {items}
      </span>
    )
  }

  const columns = [{
    title: "服务点名称",
    dataIndex: "name",
    key: 'name',
  }, {
    title: "省",
    dataIndex: "province",
    key: 'province',
    render: (text, record)=> {
      return (<div>{record.province ? record.province.label : ''}</div>)
    }
  }, {
    title: "市",
    dataIndex: "city",
    key: 'city',
    render: (text, record)=> {
      return (<div>{record.city ? record.city.label : ''}</div>)
    }
  }, {
    title: "区",
    dataIndex: "area",
    key: 'area',
    render: (text, record)=> {
      return (<div>{record.area ? record.area.label : ''}</div>)
    }
  }, {
    title: "服务点地址",
    dataIndex: "addr",
    key: 'addr',
  }, {
    title: "干衣柜数量",
    dataIndex: "deviceNo",
    key: 'deviceNo',
  }, {
    title: "管理员",
    dataIndex: "admin.nickname",
    key: 'admin.nickname'
  }, {
    title: "联系方式",
    dataIndex: "admin.mobilePhoneNumber",
    key: "admin.mobilePhoneNumber",
  }, {
    title: "状态",
    dataIndex: "status",
    key: 'status',
    render: (text, record)=> {
      return <div>{record.status ? '正常' : '已停用'}</div>
    }
  }, {
    title: '操作',
    key: 'action',
    render: renderOperationBtn,
  }];

  return (

    <div>
      <Table columns={columns} dataSource={stations} rowKey='id'/>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  let showVisible = selector.selectValidPermissions(state, [PERMISSION_CODE.STATION_BASE_QUERY, PERMISSION_CODE.STATION_QUERY_PARTNER])
  let editVisible = selector.selectValidPermissions(state, [PERMISSION_CODE.STATION_EDIT])
  let changeStatusVisible = selector.selectValidPermissions(state, [PERMISSION_CODE.STATION_CHANGE_STATUS])

  return {
    editVisible,
    showVisible,
    changeStatusVisible,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(StationList);
