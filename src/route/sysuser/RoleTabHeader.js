import React from 'react';
import {Button} from 'antd';

const RoleTabHeader = (props) => {
  return (
    <div style={{display: "flex", flexFlow: "column"}}>
      <div style={{display: "flex", alignItems: "flex-end"}}>
        <span>设置角色</span><Button type="primary" size="small" style={{marginLeft: "auto"}}>保存</Button>
      </div>
      <hr/>
    </div>);
};

export default RoleTabHeader;
