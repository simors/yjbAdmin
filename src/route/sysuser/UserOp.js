import React from 'react';
import {Button} from 'antd';
import style from './UserOp.module.scss';

const UserOp = (props) => {
  return (
    <div className={style.UserOp}>
      <Button icon="info-circle-o">查看</Button>
      <Button icon="plus-circle-o">新增</Button>
      <Button icon="edit">编辑</Button>
      <Button type="danger" icon="minus-circle-o">删除</Button>
      <Button icon="reload">刷新</Button>
    </div>
  );
};

export default UserOp;

