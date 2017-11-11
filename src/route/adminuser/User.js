import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Row, Col} from 'antd';
import UserRoleTabHeader from './UserRoleTabHeader';
import UserOp from './UserOp';
import UserFilter from './UserFilter';
import UserList from './UserList';
import UserRole from './UserRole';
import UserDetail from './UserDetail';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';
import {selector as authSelector} from '../../util/auth/';
import {PERMISSION_CODE} from '../../util/rolePermission/';
import Exception from '../../component/Exception/';

class User extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {sysUserVisible} = this.props;

    if (sysUserVisible) {
      return (
        <div>
          <Row type="flex" gutter={24}>
            <Col lg={{span: 18}}>
              <div style={{display: "flex", flexFlow: "column"}}>
                <UserOp/>
                <UserFilter/>
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
    }

    return (<Exception type="403" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />);
  };
}

const mapStateToProps = (appState, ownProps) => {
  const sysUserVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.SYSMAN_MAN_USER_ROLE]);

  return {
    sysUserVisible
  };
};

export default connect(mapStateToProps, null)(User);
