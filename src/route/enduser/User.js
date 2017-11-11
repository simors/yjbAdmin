import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Row, Col} from 'antd';
import UserFilter from './UserFilter';
import UserList from './UserList';
import {selector as authSelector} from '../../util/auth/';
import {PERMISSION_CODE} from '../../util/rolePermission/';
import Exception from '../../component/Exception/';

class User extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {manUserVisible} = this.props;

    if (manUserVisible) {
      return (
        <div>
          <Row type="flex" gutter={24}>
            <Col lg={{span: 24}}>
              <div style={{display: "flex", flexFlow: "column"}}>
                <UserFilter/>
                <UserList/>
              </div>
            </Col>
          </Row>
        </div>
      )
    }

    return (<Exception type="403" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />);
  };
}

const mapStateToProps = (appState, ownProps) => {
  const manUserVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.USER_MAN_USER_PROFILE]);

  return {
    manUserVisible
  };
};

export default connect(mapStateToProps, null)(User);
