import React from 'react';
import {connect} from 'react-redux';
import {Row, Col} from 'antd';
import UserTabHeader from './UserTabHeader';
import UserRoleTabHeader from './UserRoleTabHeader';
import UserOp from './UserOp';
import UserFilter from './UserFilter';
import UserList from './UserList';
import UserRole from './UserRole';
import {action, selector} from './redux';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: -1,
      userRoles: [],
      filter: {
        name: '',
        phoneNo: ''
      }
    };

    this.onUserChange = (record, selected, selectedRows) => {
      console.log("[DEBUG] ---> updateUserSelection, record: ", record);
      console.log("[DEBUG] ---> updateUserSelection, selected: ", selected);
      console.log("[DEBUG] ---> updateUserSelection, selectedRows: ", selectedRows);

      this.setState({
        userId: record.id,
        userRoles: record.roles
      });
    };

    this.onRoleChange = (checkedValue) => {
      this.setState((prevState, props) => {
        return {
          ...prevState,
          userRoles: checkedValue
        };
      });
    };

    this.onUserShow = () => {

    };

    this.onUserCreate = () => {

    };

    this.onUserEdit = () => {

    };

    this.onUserDelete = () => {

    };

    this.onUserSave = () => {
      this.props.userSave({
        id: this.state.userId,
        roles: this.state.userRoles
      });
    };
  }

  componentDidMount() {
    this.props.userList();
  }

  render() {
    console.log('[DEBUG] ---> SysUser render, props: ', this.props);
    return (
      <div>
        <Row type="flex" gutter={24} align="bottom">
          <Col lg={{span: 18}}>
            <UserTabHeader />
          </Col>
          <Col lg={{span: 6}}>
            <UserRoleTabHeader id={this.state.userId} onRoleSave={this.onUserSave} />
          </Col>
        </Row>
        <Row type="flex" gutter={24}>
          <Col lg={{span: 18}}>
            <div style={{display: "flex", flexFlow: "column"}}>
              <UserOp onShow={this.onUserShow} onCreate={this.onUserCreate}
                      onEdit={this.onUserEdit} onDelete={this.onUserDelete}
              />
              <UserFilter />
              <UserList users={this.props.users} onUserChange={this.onUserChange} />
            </div>
          </Col>
          <Col lg={{span: 6}}>
            <UserRole id={this.state.userId} roles={this.state.userRoles}
                      onRoleChange={this.onRoleChange}
            />
          </Col>
        </Row>
      </div>
    )
  };
}

const mapStateToProps = (appState, ownProps) => {
  return {
    userIds: selector.userIds(appState),
    users: selector.users(appState),
  };
};

const mapDispatchToProps = {
  ...action
};

export default connect(mapStateToProps, mapDispatchToProps)(User);

export {saga, reducer} from './redux';
