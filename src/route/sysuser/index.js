import React from 'react';
import {connect} from 'react-redux';
import {Row, Col} from 'antd';
import UserTabHeader from './UserTabHeader';
import RoleTabHeader from './RoleTabHeader';
import UserOp from './UserOp';
import UserSearch from './UserSearch';
import UserList from './UserList';
import UserRole from './UserRole';
import {dispatchListUser, selectUsers} from './redux';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curUserId: -1,
    }
  }

  componentDidMount() {
    this.props.dispatchListUser();
  }

  render() {
    console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        <Row type="flex" gutter={24} align="bottom">
          <Col lg={{span: 18}}>
            <UserTabHeader />
          </Col>
          <Col lg={{span: 6}}>
            <RoleTabHeader />
          </Col>
        </Row>
        <Row type="flex" gutter={24}>
          <Col lg={{span: 18}}>
            <div style={{display: "flex", flexFlow: "column"}}>
              <UserOp />
              <UserSearch />
              <UserList users={this.props.users} />
            </div>
          </Col>
          <Col lg={{span: 6}}>
            <UserRole />
          </Col>
        </Row>
      </div>
    )
  };
}

const mapStateToProps = (appState, ownProps) => {
  return {
    users: selectUsers(appState),
  };
};

const mapDispatchToProps = {
  dispatchListUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(User);

export { saga, reducer } from './redux';
