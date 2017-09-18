import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Button, Checkbox} from 'antd';
import SysUserList from './SysUserList';
import {actionListSysUsers, selectSysUsers} from './redux';
import style from './style.module.scss';

class SysUser extends React.Component {
  componentDidMount() {
    this.props.actionListSysUsers();
  }

  render() {
    console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        <Row type="flex" gutter={24} align="bottom">
          <Col lg={{span: 18}}>
            <div style={{display: "flex", flexFlow: "column"}}>
              用户信息
              <hr/>
            </div>
          </Col>
          <Col lg={{span: 6}}>
            <div style={{display: "flex", flexFlow: "column"}}>
              <div style={{display: "flex", alignItems: "flex-end"}}>
                <span>设置角色</span><Button type="primary" size="small" style={{marginLeft: "auto"}}>保存</Button>
              </div>
              <hr/>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={24}>
          <Col lg={{span: 18}}>
            <div style={{display: "flex", flexFlow: "column"}}>
              <div style={{display: "flex"}}>
                <Button icon="info-circle-o" className={style.tableButton}>查看</Button>
                <Button icon="plus-circle-o" className={style.tableButton}>新增</Button>
                <Button icon="edit" className={style.tableButton}>编辑</Button>
                <Button type="danger" icon="minus-circle-o" className={style.tableButton}>删除</Button>
                <Button icon="reload" className={style.tableButton}>刷新</Button>
              </div>
              <SysUserList users={this.props.users} />
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
}

const mapStateToProps = (appState, ownProps) => {
  return {
    users: selectSysUsers(appState),
  };
};

const mapDispatchToProps = {
  actionListSysUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(SysUser);
