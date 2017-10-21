import React from 'react';
import {Row, Col} from 'antd';
import UserTabHeader from './UserTabHeader';
import UserOp from './UserOp';
import UserFilter from './UserFilter';
import UserList from './UserList';

class User extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Row type="flex" gutter={24}>
          <Col lg={{span: 24}}>
            <div style={{display: "flex", flexFlow: "column"}}>
              <UserOp/>
              <UserFilter/>
              <UserList/>
            </div>
          </Col>
        </Row>
      </div>
    )
  };
}

export default User;
