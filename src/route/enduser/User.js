import React from 'react';
import {Row, Col} from 'antd';
import UserTabHeader from './UserTabHeader';
import UserOp from './UserOp';
import UserFilter from './UserFilter';
import UserList from './UserList';
import UserDetail from './UserDetail';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';

class User extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Row type="flex" gutter={24} align="bottom">
          <Col lg={{span: 24}}>
            <UserTabHeader/>
          </Col>
        </Row>
        <Row type="flex" gutter={24}>
          <Col lg={{span: 24}}>
            <div style={{display: "flex", flexFlow: "column"}}>
              <UserFilter/>
              <UserList/>
            </div>
          </Col>
        </Row>
        <UserDetail/>
        <UserCreate/>
        <UserEdit/>
      </div>
    )
  };
}

export default User;
