import React from 'react';
import {Button} from 'antd';
import style from './UserOp.module.scss';

const UserOp = (props) => {
  const {onShow, onAdd, onEdit, onDelete, onRefresh} = props;

  return (
    <div className={style.UserOp}>
      <Button.Group>
        <Button icon="info-circle-o" onClick={onShow}>查看</Button>
        <Button icon="plus-circle-o" onClick={onAdd}>新增</Button>
        <Button icon="edit" onClick={onEdit}>编辑</Button>
        <Button type="danger" icon="minus-circle-o" onClick={onDelete}>删除</Button>
        <Button icon="reload" onClick={onRefresh}>刷新</Button>
      </Button.Group>
    </div>
  );
};

export default UserOp;

