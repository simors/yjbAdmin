import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Button, Form, message} from 'antd';
import {action, selector} from './redux';
import Division from '../../component/DivisionCascader';

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

      const {content, area=[]} = values;
      const [province, city] = area;

      this.props.updateSending({sending: true});
      this.props.sendPromotionNotification({
        province,
        city,
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
            <div>营销推送</div>
            <hr/>
          </Row>
          <Row style={{padding: '8px 0'}}>
            <Col offset={2} span={16}>
              <Form.Item
                colon={false}
                label='信息内容'
              > {
                getFieldDecorator('content', {})(
                  <Input.TextArea autosize={{minRows: 6}}/>
                )
              }
              </Form.Item>
            </Col>
          </Row>
          <Row type='flex' align='bottom'>
            <Col offset={2} span={8}>
              <Form.Item
                colon={false}
                label='选择发送地区'
                style={{marginBottom: '0'}}
              > {
                getFieldDecorator('area', {})(
                  <Division level={2}/>
                )
              }
              </Form.Item>
            </Col>
            <Col offset={6} span={8}>
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
