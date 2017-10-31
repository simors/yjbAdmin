import React from 'react';
import {Row, Col, Input, Button} from 'antd';

class System extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick = () => {
    console.log('TODO: send');
  };

  render() {
    return (
      <div>
        <Row>
          <div>系统消息</div>
          <hr/>
        </Row>
        <Row style={{padding: '16px 0'}}>
          <Col offset={2} span={16}>
            <div style={{paddingBottom: '8px'}}>系统消息将通过微信推送给平台上的所有用户</div>
            <Input.TextArea autosize={{minRows: 5}}>
            </Input.TextArea>
          </Col>
        </Row>
        <Row>
          <Col offset={16}>
            <Button type='primary' onClick={this.onClick}>发送</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default System;
