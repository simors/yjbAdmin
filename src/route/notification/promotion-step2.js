import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Icon, Button} from 'antd';
import {action} from './redux';
import Result from '../../component/Result';

class System extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick = () => {
    this.props.updateStep({curStep: 1});
  };

  render() {
    const actions = (
      <div>
        <Button type="primary" onClick={this.onClick}>
          返回
        </Button>
      </div>
    );

    return (
      <Result
        type="success"
        title="发送成功"
        actions={actions}
      />
    );
  }
}

const mapDispatchToProps = {
  ...action,
};

export default connect(null, mapDispatchToProps)(System);
