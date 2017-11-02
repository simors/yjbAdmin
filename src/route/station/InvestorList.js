/**
 * Created by lilu on 2017/9/21.
 */

import React from 'react';
import {Table,Button} from 'antd';
import {connect} from 'react-redux';
import {selector} from '../../util/auth'
import {PERMISSION_CODE} from '../../util/rolePermission'

const rowKey = (record) => {
  return record.id;
};


const InvestorList = (props) => {
  let {investors, selectStation,editInvestor,setInvestorStatus, editVisible, changeStatusVisible} = props;
  if (investors === null) {
    investors = [];
  }
  const rowSelection = {
    type: 'radio',
    onChange: (rowKey, rowData)=> {
      selectStation(rowKey, rowData)
    },
  };

  const renderOperateBtn = (text, record) => {
    let items = []
    if (editVisible) {
      items.push(<a key='a' style={{color: `blue`}} onClick={()=> {editInvestor(record)}}>编辑</a>)
      items.push(<span key='b' className="ant-divider" />)
    }
    if (changeStatusVisible) {
      let changeBtn = (
        record.status ?
          <a key='c' style={{color: `blue`}} onClick={()=> {setInvestorStatus(record)}}>停用</a>
          :
          <a key='d' style={{color: `blue`}} onClick={()=> {setInvestorStatus(record)}}>启用</a>
      )
      items.push(changeBtn)
      items.push(<span key='e' className="ant-divider" />)
    }
    if (items.length >= 2) {
      items.pop()
    }
    return (
      <span key='g'>
        {items}
      </span>
    )
  }

  const columns = [{
    title: "创建时间",
    dataIndex: "createdAt",
    render: (createdAt)=> {
      return <div>{createdAt.slice(0, 10) }</div>
    }
  }, {
    title: "姓名",
    dataIndex: "shareholder.nickname",
  }, {
    title: "联系方式",
    dataIndex: "shareholder.mobilePhoneNumber",
  }, {
    title: "投资服务点",
    dataIndex: "station.name",
  }, {
    title: "投资金额",
    dataIndex: "investment",
  }, {
    title: "投资占比",
    dataIndex: "royalty",
    render: (text, record)=> {
      return <div>{record.royalty * 100 + '%'}</div>
    }
  }, {
    title: "状态",
    dataIndex: "status",
    render: (text, record)=> {
      return <div>{record.status ? '正常' : '已停用'}</div>
    }
  }];

  if (editVisible || changeStatusVisible) {
    columns.push({
      title: '操作',
      render: renderOperateBtn,
    })
  }

  return (
    <div>
      <Table columns={columns} dataSource={investors} rowKey={rowKey} />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  let editVisible = selector.selectValidPermissions(state, [PERMISSION_CODE.STATION_INVESTOR_EDIT])
  let changeStatusVisible = selector.selectValidPermissions(state, [PERMISSION_CODE.STATION_INVESTOR_CHANGE_STATUS])

  return {
    editVisible,
    changeStatusVisible,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(InvestorList);

