import React from 'react';
import {connect} from 'react-redux';
import {Button, Modal} from 'antd';
import {action, selector} from './redux';
import {action as authAction} from '../../util/auth';
import style from './UserOp.module.scss';

class UserOp extends React.Component {
  constructor(props) {
    super(props);
  }

  onRefresh = () => {
    this.props.listEndUsers({limit: 100});
  };

  render() {
    return (
      <div className={style.UserOp}>
        <Button.Group>
          <Button icon="reload"
                  onClick={this.onRefresh}>
            刷新
          </Button>
        </Button.Group>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserOp);
