import React from 'react';
import {Checkbox} from 'antd';

const UserRole = (props) => {
  return (
    <div style={{display: "flex", flexFlow: "column"}}>
      <ul>
        <li><Checkbox>平台管理员</Checkbox></li>
        <li><Checkbox>服务点管理员</Checkbox></li>
        <li><Checkbox>服务点投资人</Checkbox></li>
        <li><Checkbox>服务单位</Checkbox></li>
      </ul>
    </div>
  );
};

export default UserRole;
