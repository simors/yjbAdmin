import React from 'react';
import {connect} from 'react-redux';
import {action, selector} from './redux';


class UserRoleTabHeader extends React.Component {
  constructor(props) {
    super(props);

  }

  onSave = () => {

  };

  render() {
    return (
      <div style={{display: "flex", flexFlow: "column"}}>
        <div style={{display: "flex", alignItems: "flex-end"}}>
          <span>用户角色</span>
        </div>
        <hr/>
      </div>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const selectedUserIds = selector.selectSelectedUserIds(appState);
  const checkedUserRoles = selector.selectCheckedUserRoles(appState);

  return {
    selectedUserIds,
    checkedUserRoles,
  };
};

const mapDispatchToProps = {
  ...action,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRoleTabHeader);
