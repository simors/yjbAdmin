/**
 * Created by lilu on 2017/9/23.
 */


import React from 'react';
import {Table, Button} from 'antd';
import mathjs from 'mathjs'

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
  let {editPartner, partners, selectStation, type, setPartnerStatus} = props;
  if (partners === null) {
    partners = [];
  }

  const columns = [{
    title: "分成方",
    dataIndex: "shareholder.nickname",
  }, {
    title: "分成比例",
    dataIndex: "royalty",
    render: (text,record)=>{
      return(
        <div>{mathjs.chain(record.royalty).multiply(100).done()+'%'}</div>
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
          <a style={{color: `blue`}} onClick={()=> {
            editPartner(record)
          }}>编辑</a>
                              <span className="ant-divider" />

          {record.status?<a style={{color: `blue`}} onClick={()=> {
            setPartnerStatus(record)
          }}>停用</a>:<a style={{color: `blue`}} onClick={()=> {
            setPartnerStatus(record)
          }}>启用</a>}
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

export default PartnerList;
