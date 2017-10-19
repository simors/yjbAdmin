/**
 * Created by yangyang on 2017/10/19.
 */
import React from 'react'
import {connect} from 'react-redux'
import { Row, Col, Modal, Form, Popconfirm, InputNumber, Button } from 'antd'

const FormItem = Form.Item

class Withdraw extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  closeModel = () => {
    let {onCancel} = this.props
    onCancel()
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['withdraw'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title="收益取现"
          visible={true}
          footer={null}
          onCancel={this.closeModel}
        >
          <Row justify="center">
            <Col span={10} offset={1}>
              <div style={{fontSize: 16, marginBottom: 10}}>输入提现金额</div>
              <div style={{marginLeft: 20}}>
                <Form onSubmit={this.handleSubmit}>
                  <FormItem help="一次最多提取9999.99元，精确到2位小数">
                    {getFieldDecorator('withdraw', {
                      rules:
                        [
                          {required: true, type: 'number', message: '请输入取现金额'},
                        ],
                    })(
                      <InputNumber
                        style={{width: '100%'}}
                        formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                        precision={2}
                        max={9999.99}
                      />
                    )}
                  </FormItem>
                </Form>
              </div>
              <div style={{marginLeft: 20}}>余额 ¥234334.12</div>
              <div style={{marginTop: 10, marginLeft: 20, color: 'red'}}>若没有关注衣家宝微信公众号，请先关注并绑定个人信息后再提现</div>
              <div style={{marginTop: 20, marginLeft: 20}}>
                <Popconfirm placement="top" title="确认需要取现吗？" onConfirm={this.handleSubmit} okText="是的" cancelText="再想想">
                  <Button type="primary" size="large">取现到微信余额</Button>
                </Popconfirm>
              </div>
            </Col>
            <Col span={12} offset={1}>
              <img src={require('../../asset/image/qrcode_mp_yjb.jpg')} width={250} height={250} />
              <div style={{textAlign: 'center'}}>使用微信扫一扫关注公众号，并绑定手机号</div>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Withdraw))