import React from 'react';
import {Row, Col} from 'antd';
import UserRoleTabHeader from './UserRoleTabHeader';
import UserOp from './UserOp';
import UserFilter from './UserFilter';
import UserList from './UserList';
import UserRole from './UserRole';
import UserDetail from './UserDetail';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefresh: false,
    }
  }

  refresh = () => {
    this.setState({isRefresh: true})
    setTimeout(() => this.setState({isRefresh: false}), 1000)
  };

  render() {
    return (
      <div>
        <Row type="flex" gutter={24}>
          <Col lg={{span: 18}}>
            <div style={{display: "flex", flexFlow: "column"}}>
              <UserOp onRefresh={this.refresh}/>
              <UserFilter isRefresh={this.state.isRefresh}/>
              <UserList/>
            </div>
          </Col>
          <Col lg={{span: 6}}>
            <UserRoleTabHeader/>
            <UserRole/>
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
