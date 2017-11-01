import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Button, Form, message} from 'antd';
import {action, selector} from './redux';

class System extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      const {content} = values;
      this.props.updateSending({sending: true});
      this.props.sendSystemNotification({
        content: content.trim(),
        onFailure: (code) => {
          message.error(`发送失败，错误：${code}`);
        },
        onSuccess: () => {
          this.props.updateStep({curStep: 2});
        },
        onComplete: () => {
          this.props.updateSending({sending: false});
        }
      });

    });
  };

  render() {
    const {sending} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    return (
      <div style={{paddingBottom: '16px'}}>
        <Form>
          <Row>
            <div>系统消息</div>
            <hr/>
          </Row>
          <Row style={{padding: '8px 0'}}>
            <Col offset={2} span={16}>
              <Form.Item
                colon={false}
                label='系统消息将通过微信推送给平台上的所有用户'
              > {
                getFieldDecorator('content', {})(
                  <Input.TextArea autosize={{minRows: 6}}/>
                )
              }
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col offset={16}>
              <Button type='primary'
                      onClick={this.onClick}
                      loading={sending}
                      disabled={!getFieldValue('content') || !getFieldValue('content').trim().length}
              >
                发送
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const sending = selector.selectSending(appState);

  return {
    sending,
  };
};

const mapDispatchToProps = {
  ...action,
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(System));
