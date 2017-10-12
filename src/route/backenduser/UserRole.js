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

  onChange = (checkedValue) => {
    // this.props.updateCheckedUserRoles({checked: checkedValue});
  };

  render() {
    const roleOptions = [];
    this.props.allRoles.forEach((i) => {
      roleOptions.push({
        label: i.displayName,
        value: i.objectId
      })
    });

    return (
      <div className={style.UserRole}>
        <Checkbox.Group disabled={this.props.selectedUserIds.length !== 1}
                        options={roleOptions} value={this.props.checkedUserRoles}
                        onChange={this.onChange}/>
      </div>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const allRoles = authSelector.selectAllRoles(appState);
  const selectedUserIds = selector.selectSelectedUserIds(appState);
  const checkedUserRoles = selector.selectCheckedUserRoles(appState);

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
