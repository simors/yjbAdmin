import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'antd';
import {action} from './redux';
import {action as authAction} from '../../util/auth';

class UserOp extends React.Component {
  constructor(props) {
    super(props);
  }

  onCreate = () => {
    this.props.showUserCreateModal({});
  };

  render() {
    return (
      <Button.Group>
        <Button icon="plus-circle-o"
                onClick={this.onCreate}>
          新增
        </Button>
      </Button.Group>
    );
  }
}

const mapDispatchToProps = {
  ...action,
  ...authAction,
};

export default connect(null, mapDispatchToProps)(UserOp);
