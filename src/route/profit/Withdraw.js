/**
 * Created by yangyang on 2017/10/19.
 */
import React from 'react'
import {connect} from 'react-redux'
import { Row, Col, Modal, Form, Popconfirm, InputNumber, Button, message } from 'antd'
import {profitSelector, profitAction, DEAL_TYPE} from './redux'
import {selector as authSelector} from '../../util/auth'
import * as errno from '../../errno'

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
    let {currentUser} = this.props
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);
        message.error('数据输入错误，请检查输入金额')
      }
      this.props.requestWithdraw({
        amount: values.withdraw,
        channel: 'wx_pub',
        metadata: {
          'fromUser': 'platform',
          'toUser': currentUser.id,
          'dealType': DEAL_TYPE.WITHDRAW
        },
        openid: currentUser.authData.weixin.openid,
        username: '',
        success: () => {
          this.closeModel()
          message.success('取现申请提交成功，请稍后查看收益余额及微信钱包')
          this.props.getCurrentAdminProfit({
            error: () => {
              message.error('获取新的收益余额失败')
            }
          })
        },
        error: (error) => {
          this.closeModel()
          switch (error.code) {
            case errno.ERROR_IN_WITHDRAW_PROCESS:
              message.error('最近已提交过申请，请等待上一笔取现申请处理完后再重新取现')
              break
            case errno.ERROR_NOT_ENOUGH_MONEY:
              message.error('余额不足')
              break
            case errno.ERROR_NOT_WITHDRAW_DATE:
              message.error('只允许在每个月的10号到15号提交取现申请')
              break
            case errno.ERROR_UNSUPPORT_CHANNEL:
              message.error('不支持的取现渠道')
              break
            default:
              message.error('提现失败，请联系客服')
          }
        }
      })
    })
  }

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['withdraw'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let {adminProfit} = this.props
    if (!adminProfit) {
      return null
    }
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
              <div style={{marginLeft: 20}}>余额 ¥{Number(adminProfit.balance).toFixed(2)}</div>
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
  let adminProfit = profitSelector.selectAdminProfit(state)
  let currentUser = authSelector.selectCurUser(state)
  return {
    adminProfit,
    currentUser,
  }
}

const mapDispatchToProps = {
  ...profitAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Withdraw))