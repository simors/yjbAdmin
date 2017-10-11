import React from 'react';
import {connect} from 'react-redux';
import {Checkbox} from 'antd';
import {action, selector} from './redux';
import {action as authAction} from '../../util/auth/';
import style from './UserRole.module.scss';

const kRoles = [
  {label: '平台管理员', value: 100},
  {label: '服务点管理员', value: 200},
  {label: '服务点投资人', value: 300},
  {label: '服务单位', value: 400}
];

class UserRole extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange = (checkedValue) => {
    // this.props.updateCheckedUserRoles({checked: checkedValue});
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
