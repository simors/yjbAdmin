import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'antd';
import {action, selector} from './redux';
import {action as authAction} from '../../util/auth';

class UserOp extends React.Component {
  constructor(props) {
    super(props);
  }

  onRefresh = () => {
    this.props.resetFilter({});
    this.props.listEndUsers({
      limit: 1000,
      onStart: () => {
        this.props.changeLoading({loading: true});
      },
      onComplete: () => {
        this.props.changeLoading({loading: false});
      },
    });
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
