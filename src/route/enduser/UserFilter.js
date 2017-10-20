import React from 'react';
import {Col, Input, Button} from 'antd';
import style from './UserFilter.module.scss';

const UserFilter = (props) => {
  return (
    <div className={style.UserFilter}>
      <div className={style.name}>
        <label>姓名:</label><Input />
      </div>
      <div className={style.phoneNo}>
        <label>手机号码:</label><Input />
      </div>
      <div className={style.buttonGroup}>
        <Button.Group>
          <Button>重置</Button>
          <Button>查询</Button>
        </Button.Group>
      </div>
    </div>
  );
};

export default UserFilter;
