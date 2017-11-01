import React from 'react';
import {Row, Col, Input, Button} from 'antd';
import Division from '../../component/DivisionCascader'

class Promotion extends React.Component {
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
          <div>营销推送</div>
          <hr/>
        </Row>
        <Row style={{padding: '16px 0'}}>
          <Col offset={2} span={16}>
            <div style={{paddingBottom: '8px'}}>信息内容</div>
            <Input.TextArea autosize={{minRows: 5}}>
            </Input.TextArea>
          </Col>
        </Row>
        <Row>
          <Col span={8} offset={2}>
            <div style={{paddingBottom: '8px'}}>选择发送地区</div>
          </Col>
        </Row>
        <Row>
          <Col offset={2} span={8}>
            <Division level={2}/>
          </Col>
          <Col offset={16}>
            <Button type='primary' onClick={this.onClick}>发送</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Promotion;
