/**
 * Created by lilu on 2017/9/19.
 */
import React from 'react';
import {Table, Button, Popconfirm} from 'antd';
import {connect} from 'react-redux';
import {selector} from '../../util/auth'
import {PERMISSION_CODE} from '../../util/rolePermission'

const StationList = (props) => {
  let {stations, editStation, showStation, showVisible, editVisible} = props;
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

  return {
    editVisible,
    showVisible,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(StationList);
