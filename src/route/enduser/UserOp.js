import React from 'react';
import {connect} from 'react-redux';
import {Button, Modal} from 'antd';
import {action, selector} from './redux';
import {action as authAction} from '../../util/auth';

class UserOp extends React.Component {
  constructor(props) {
    super(props);
  }

  onRefresh = () => {
    this.props.resetFilter({reset: true});
    this.props.listEndUsers({limit: 100});
  };

  render() {
    return (
      <Button.Group>
        <Button icon="reload"
                onClick={this.onRefresh}>
          刷新
        </Button>
      </Button.Group>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const selectedUserIds = selector.selectSelectedUserIds(appState);

  return {
    selectedUserIds,
  };
};

const mapDispatchToProps = {
  ...action,
  ...authAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserOp);
