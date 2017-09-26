/**
 * Created by lilu on 2017/9/23.
 */


import React from 'react';
import {Table, Button} from 'antd';

const showColumns = [{
  title: "分成方",
  dataIndex: "shareholderName",
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
  let {editPartner, partners, selectStation,type, delectPartner} = props;
  if (partners === null) {
    partners = [];
  }

  const columns = [{
    title: "分成方",
    dataIndex: "shareholderName",
  }, {
    title: "分成比例",
    dataIndex: "royalty",
  }, {
    title: '操作',
    render: (text, record)=> {
      // console.log('record=====>',record)
      return (
        <div>
          <Button onClick={()=>{editPartner(record)}}>编辑</Button>
          <Button onClick={()=>{delectPartner()}}>删除</Button>
        </div>
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
      <Table columns={type=='show'?showColumns:columns} dataSource={partners} rowKey={rowKey}/>
    </div>
  );
};

export default PartnerList;
