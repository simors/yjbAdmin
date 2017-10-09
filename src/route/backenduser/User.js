import React from 'react';
import {Row, Col} from 'antd';
import UserTabHeader from './UserTabHeader';
import UserRoleTabHeader from './UserRoleTabHeader';
import UserOp from './UserOp';
import UserFilter from './UserFilter';
import UserList from './UserList';
import UserRole from './UserRole';
import UserDetail from './UserDetail';
import UserCreate from './UserCreate';

class User extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Row type="flex" gutter={24} align="bottom">
          <Col lg={{span: 18}}>
            <UserTabHeader/>
          </Col>
          <Col lg={{span: 6}}>
            <UserRoleTabHeader/>
          </Col>
        </Row>
        <Row type="flex" gutter={24}>
          <Col lg={{span: 18}}>
            <div style={{display: "flex", flexFlow: "column"}}>
              <UserOp/>
              <UserFilter/>
              <UserList/>
            </div>
          </Col>
          <Col lg={{span: 6}}>
            <UserRole/>
          </Col>
        </Row>
        <UserDetail/>
        <UserCreate/>
      </div>
    )
  };
}

export default User;
