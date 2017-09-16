import React from 'react';
import {Row, Col, Button, Checkbox} from 'antd';
import style from './style.module.scss'

const SysUser = (props) => {
  console.log('[DEBUG] ---> SysUser props: ', props);
  return (
    <div>
      <Row type="flex" gutter={16} align="bottom">
        <Col lg={{span: 18}}>
          <div style={{display: "flex", flexFlow: "column"}}>
            用户信息
            <hr />
          </div>
        </Col>
        <Col lg={{span: 6}}>
          <div style={{display: "flex", flexFlow: "column"}}>
            <div style={{display: "flex", alignItems: "flex-end"}}>
              <span>设置角色</span><Button type='primary' style={{marginLeft: "auto"}}>保存</Button>
            </div>
            <hr />
          </div>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col lg={{span: 18}}>
          <div style={{display: "flex", flexFlow: "column"}}>
            <div style={{display: "flex"}}>
              <span>搜索</span><span>查看</span><span>新增</span>
              <span>编辑</span><span>删除</span><span>刷新</span>
            </div>
          </div>
        </Col>
        <Col lg={{span: 6}}>
          <div style={{display: "flex", flexFlow: "column"}}>
            <ul>
              <li><Checkbox>平台管理员</Checkbox></li>
              <li><Checkbox>服务点管理员</Checkbox></li>
              <li><Checkbox>服务点投资人</Checkbox></li>
              <li><Checkbox>服务单位</Checkbox></li>
            </ul>
          </div>
        </Col>
      </Row>
    </div>
  )
};

export default SysUser;
