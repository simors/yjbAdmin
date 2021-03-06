/**
 * Created by lilu on 2017/9/23.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Table, Button, Popconfirm} from 'antd';
import mathjs from 'mathjs'
import {selector as authSelector} from '../../util/auth/'
import {PERMISSION_CODE} from '../../util/rolePermission/'

const showColumns = [{
  title: "分成方",
  dataIndex: "shareholder.nickname",
}, {
  title: "分成比例",
  dataIndex: "royalty",
},
]


const rowKey = (record) => {
  return record.shareholderId;
};


const PartnerList = (props) => {
  // console.log('[DEBUG] ---> UserList props: ', props);
  let {editPartner, partners, selectStation, type, setPartnerStatus, changePartnerVisible} = props;
  if (partners === null) {
    partners = [];
  }

  const columns = [{
    title: "分成方",
    dataIndex: "shareholder.nickname",
  }, {
    title: "分成比例",
    dataIndex: "royalty",
    render: (text, record)=> {
      return (
        <div>{mathjs.chain(record.royalty).multiply(100).done() + '%'}</div>
      )
    }
  }, {
    title: '状态',
    render: (text, record)=> {
      return (
        <div>{record.status == 1 ? '正常' : '停用'}</div>
      )
    }
  }, {
    title: '操作',
    render: (text, record)=> {
      return (
        <span>
          <a style={{color: `blue`}} onClick={()=> {editPartner(record)}}>编辑</a>
          <span className="ant-divider"/>

          {changePartnerVisible ?
            (record.status ?
              <Popconfirm title="确定停用该服务单位？" onConfirm={()=> {
                setPartnerStatus(record)
              }}>
                <a style={{color: `blue`}}>停用</a>
              </Popconfirm>
              :
              <Popconfirm title="确定启用该服务单位？" onConfirm={()=> {
                setPartnerStatus(record)
              }}>
                <a style={{color: `blue`}}>启用</a>
              </Popconfirm>
            ) : null
          }
        </span>
      )
    }
  }
  ];

  const rowSelection = {
    type: 'radio',
    onChange: (rowKey, rowData)=> {
      selectStation(rowKey, rowData)
    },
  };
  // console.log('[DEBUG] ---> UserList users: ', stations);

  return (
    <div>
      <Table columns={type == 'show' ? showColumns : columns} dataSource={partners} rowKey={rowKey}/>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  let changePartnerVisible = authSelector.selectValidPermissions(state, [PERMISSION_CODE.STATION_CHANGE_PARTNER_STATUS])

  return {
    changePartnerVisible,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(PartnerList)
