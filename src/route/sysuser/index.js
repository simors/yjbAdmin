import React from 'react';
import {connect} from 'react-redux';
import {Row, Col} from 'antd';
import {sagaAction, selector} from './redux';
import UserTabHeader from './UserTabHeader';
import UserRoleTabHeader from './UserRoleTabHeader';
import UserOp from './UserOp';
import UserFilter from './UserFilter';
import UserList from './UserList';
import UserRole from './UserRole';
import UserDetail from './UserDetail';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: -1,
      roles: [],
      filter: {
        name: '',
        phoneNo: ''
      }
    };
  }

  onUserChange = (record, selected, selectedRows) => {
    console.log("[DEBUG] ---> updateUserSelection, record: ", record);
    console.log("[DEBUG] ---> updateUserSelection, selected: ", selected);
    console.log("[DEBUG] ---> updateUserSelection, selectedRows: ", selectedRows);

    this.setState({
      id: record.id,
      roles: record.roles
    });
  };

  onRoleChange = (checkedValue) => {
    this.setState((prevState, props) => {
      return {
        ...prevState,
        roles: checkedValue
      };
    });
  };

  onUserDetail = () => {
    if (this.id !== -1) {
      this.props.UserDetail_open({id: this.state.id});
    }
  };

  render() {
    console.log('[DEBUG] ---> User render, props: ', this.props);
    return (
      <div>
        <Row type="flex" gutter={24} align="bottom">
          <Col lg={{span: 18}}>
            <UserTabHeader />
          </Col>
          <Col lg={{span: 6}}>
            <UserRoleTabHeader id={this.state.id} />
          </Col>
        </Row>
        <Row type="flex" gutter={24}>
          <Col lg={{span: 18}}>
            <div style={{display: "flex", flexFlow: "column"}}>
              <UserOp id={this.state.id}
                      onDetail={this.onUserDetail}
              />
              <UserFilter />
              <UserList onUserChange={this.onUserChange} />
            </div>
          </Col>
          <Col lg={{span: 6}}>
            <UserRole id={this.state.id} roles={this.state.roles}
                      onChange={this.onRoleChange}
            />
          </Col>
        </Row>
        <UserDetail />
      </div>
    )
  };
}

const mapDispatchToProps = {
  ...sagaAction,
};

export default connect(null, mapDispatchToProps)(User);

export {saga, reducer} from './redux';
