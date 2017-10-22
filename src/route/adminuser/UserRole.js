import React from 'react';
import {connect} from 'react-redux';
import {Checkbox} from 'antd';
import {action, selector} from './redux';
import {action as authAction, selector as authSelector} from '../../util/auth/';
import style from './UserRole.module.scss';

class UserRole extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const roleOptions = [];
    this.props.allRoles.forEach((i) => {
      roleOptions.push({
        label: i.displayName,
        value: i.code
      })
    });

    return (
      <div className={style.UserRole}>
        <Checkbox.Group
          options={roleOptions} value={this.props.checkedUserRoles}
        />
      </div>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const allRoles = authSelector.selectRoles(appState);
  const selectedUserIds = selector.selectSelectedUserIds(appState);

  let checkedUserRoles = [];
  if (selectedUserIds.length === 1) {
    const userId = selectedUserIds[0];
    const user = authSelector.selectUserById(appState, userId);

    checkedUserRoles = user.roles;
  }

  return {
    allRoles,
    selectedUserIds,
    checkedUserRoles,
  };
};

const mapDispatchToProps = {
  ...action,
  ...authAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRole);
