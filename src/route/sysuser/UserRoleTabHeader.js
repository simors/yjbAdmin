import React from 'react';
import {Button} from 'antd';

const UserRoleTabHeader = (props) => {
  const {id, onRoleSave: onSave} = props;
  return (
    <div style={{display: "flex", flexFlow: "column"}}>
      <div style={{display: "flex", alignItems: "flex-end"}}>
        <span>设置角色</span>
        <Button type="primary" size="small" disabled={id === -1}
                style={{marginLeft: "auto"}}
                onClick={onSave}>
          保存
        </Button>
      </div>
      <hr/>
    </div>);
};

export default UserRoleTabHeader;
