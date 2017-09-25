import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'antd';
import {sagaAction} from './redux';
import style from './UserOp.module.scss';

class UserOp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {id} = this.props;
    return (
      <div className={style.UserOp}>
        <Button.Group>
          <Button icon="info-circle-o" disabled={id === -1} onClick={this.props.sagaUserDetailModalShow}>查看</Button>
          <Button icon="plus-circle-o" onClick={this.props.onCreate}>新增</Button>
          <Button icon="edit" disabled={id === -1} onClick={this.props.onEdit}>编辑</Button>
          <Button type="danger" icon="minus-circle-o" disabled={id === -1} onClick={this.props.onDelete}>删除</Button>
          <Button icon="reload" onClick={this.props.onRefresh}>刷新</Button>
        </Button.Group>
      </div>
    );
  }
}

const mapDispatchToProps = {
  ...sagaAction,
};

export default connect(null, mapDispatchToProps)(UserOp);
