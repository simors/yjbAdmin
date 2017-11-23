/**
 * Created by yangyang on 2017/10/19.
 */
import React from 'react'
import {connect} from 'react-redux'
import { Row, Col, Modal, Form, Popconfirm, InputNumber, Button, message } from 'antd'
import {profitSelector, profitAction} from './redux'
import {selector as authSelector} from '../../util/auth'
import * as errno from '../../errno'

const FormItem = Form.Item

class Withdraw extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  closeModel = () => {
    let {onCancel} = this.props
    onCancel()
  }

  hasErrors(fieldsError, values, balance) {
    if (Object.keys(fieldsError).some(field => fieldsError[field])) {
      return true
    }
    let isValid = values['withdraw'] > 0 && values['withdraw'] <= balance && values['withdraw'] <= 9999
    return !isValid
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('数据输入错误，请检查输入金额')
        return
      }
      this.props.requestProfitWithdraw({
        amount: values.withdraw,
        success: () => {
          this.closeModel()
          message.success('取现申请提交成功，7个工作日到账')
        },
        error: (error) => {
          this.closeModel()
          switch (error.code) {
            case errno.ERROR_NO_WECHAT:
              message.error('未绑定微信号，不能取现')
              break
            case errno.ERROR_IN_WITHDRAW_PROCESS:
              message.error('已经处于提现申请的状态中')
              break
            case errno.ERROR_NOT_ENOUGH_MONEY:
              message.error('余额不足')
              break
            default:
              message.error('提交取现申请失败，请重试' + error.code)
          }
        }
      })
    })
  }

  render() {
    const { getFieldDecorator, getFieldsValue, getFieldsError } = this.props.form
    let {adminProfit, currentUser} = this.props
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
          <Row>
            <Col span={12}>
              <div style={{fontSize: 16, marginBottom: 10}}>输入提现金额</div>
              <div style={{marginLeft: 20}}>
                <Form onSubmit={this.handleSubmit}>
                  <FormItem help="一次最多提取9999元，只允许输入整数值">
                    {getFieldDecorator('withdraw', {
                      rules:
                        [
                          {required: true, type: 'integer', message: '请输入取现金额'},
                        ],
                    })(
                      <InputNumber
                        style={{width: '100%'}}
                        formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                        precision={0}
                        max={9999}
                        min={1}
                      />
                    )}
                  </FormItem>
                </Form>
              </div>
              <div style={{marginLeft: 20}}>余额 ¥{Number(adminProfit.balance).toFixed(2).toLocaleString()}</div>

              <div style={{marginTop: 20, marginLeft: 20}}>
                <Popconfirm placement="top" title="确认需要取现吗？" onConfirm={this.handleSubmit} okText="是的" cancelText="再想想">
                  <Button type="primary" size="large" disabled={Number(adminProfit.balance) <= 0 || this.hasErrors(getFieldsError(), getFieldsValue(), adminProfit.balance)}>取现到微信余额</Button>
                </Popconfirm>
              </div>
            </Col>
            <Col span={11} offset={1} style={{textAlign: 'center'}}>
              <img src={currentUser.avatar} width={200} height={200} />
              <div style={{marginTop: 10, color: 'red'}}>取现金额将在7个工作日内以零钱的方式充入您的微信钱包，请注意查收</div>
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
