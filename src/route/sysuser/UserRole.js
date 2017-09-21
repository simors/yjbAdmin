import React from 'react';
import {Checkbox} from 'antd';
import style from './UserRole.module.scss';

const kRoles = ['平台管理员', '服务点管理员', '服务点投资人', '服务单位'];

const UserRole = (props) => {
  const {id, roles, onChange} = props;
  return (
    <div className={style.UserRole}>
      <Checkbox.Group disabled={id === -1} options={kRoles} value={roles} onChange={onChange}/>
    </div>
  );
};

export default UserRole;
