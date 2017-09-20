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
      curUser: {
        id: -1,
        roles: []
      }
    };

    this.onUserChange = (record, selected, selectedRows) => {
      console.log("[DEBUG] ---> updateUserSelection, record: ", record);
      console.log("[DEBUG] ---> updateUserSelection, selected: ", selected);
      console.log("[DEBUG] ---> updateUserSelection, selectedRows: ", selectedRows);

      this.setState({
        curUser: {
          id: record.id,
          roles: record.roles}
      });
    };

    this.onRoleChange = (checkedValue) => {
      this.setState((prevState, props) => {
        return {
          curUser: {
            ...prevState.curUser,
            roles: checkedValue
          }
        };
      });
    };

    this.onRoleSave = () => {
      this.props.saveRole(this.state.curUser);
    };
  }

  componentDidMount() {
    this.props.listUser();
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
            <UserRoleTabHeader id={this.state.curUser.id} onRoleSave={this.onRoleSave} />
          </Col>
        </Row>
        <Row type="flex" gutter={24}>
          <Col lg={{span: 18}}>
            <div style={{display: "flex", flexFlow: "column"}}>
              <UserOp />
              <UserFilter />
              <UserList users={this.props.users} onUserChange={this.onUserChange} />
            </div>
          </Col>
          <Col lg={{span: 6}}>
            <UserRole id={this.state.curUser.id} roles={this.state.curUser.roles}
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
    users: selector.selectUser(appState),
  };
};

const mapDispatchToProps = {
  ...action
};

export default connect(mapStateToProps, mapDispatchToProps)(User);

export {saga, reducer} from './redux';
