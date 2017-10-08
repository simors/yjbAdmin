import React from 'react';
import {connect} from 'react-redux';
import {Checkbox} from 'antd';
import {action, selector} from './redux';
import {action as authAction} from '../../util/auth/';
import style from './UserRole.module.scss';

const kRoles = ['平台管理员', '服务点管理员', '服务点投资人', '服务单位'];

class UserRole extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange = (checkedValue) => {
    this.props.updateCheckedUserRoles({checked: checkedValue});
  };

  render() {
    return (
      <div className={style.UserRole}>
        <Checkbox.Group disabled={this.props.selectedUserIds.length !== 1}
                        options={kRoles} value={this.props.checkedUserRoles}
                        onChange={this.onChange}/>
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
  ...authAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRole);
