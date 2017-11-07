/**
 * Created by yangyang on 2017/11/7.
 */
import React from 'react'
import {connect} from 'react-redux'
import { Row, Col, DatePicker, Form, Table, Button, message } from 'antd'
import {profitSelector, profitAction} from './redux'
import moment from "moment"
import {WITHDRAW_STATUS, orderSelector} from '../order'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

class WithdrawLog extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  componentDidMount() {
    this.setState({loading: true})
    this.props.fetchMineWithdrawLog({
      success: () => {
        this.setState({loading: false})
      },
      error: () => {
        this.setState({loading: false})
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({loading: true})
    let {fetchMineWithdrawLog} = this.props
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const rangeTimeValue = fieldsValue['rangeTimePicker']
      let values = fieldsValue
      if(rangeTimeValue && rangeTimeValue.length === 2) {
        values = {
          ...fieldsValue,
          'rangeTimePicker': [
            rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
            rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
          ],
        }
      }
      fetchMineWithdrawLog({
        start: values.rangeTimePicker? values.rangeTimePicker[0] : undefined,
        end: values.rangeTimePicker? values.rangeTimePicker[1] : undefined,
        success: () => {
          this.setState({loading: false})
        },
        error: () => {
          this.setState({loading: false})
        }
      })
    })
  }

  renderSearchBar() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form style={{marginBottom: 12}} layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator("rangeTimePicker", {
            rules: [{ type: 'array'}],
          })(
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
        </FormItem>
        <FormItem>
          <Button.Group>
            <Button onClick={() => {this.props.form.resetFields()}}>重置</Button>
            <Button type="primary" htmlType="submit">查询</Button>
          </Button.Group>
        </FormItem>
      </Form>
    )
  }

  renderTable() {
    const {loading} = this.state
    let columns = [
      { title: '申请日期', dataIndex: 'applyDate', key: 'applyDate', render: (applyDate) => (<span>{moment(new Date(applyDate)).format('LLLL')}</span>) },
      { title: '金额（元）', dataIndex: 'amount', key: 'amount', render: (amount) => (<span>{'¥ ' + Number(amount).toLocaleString()}</span>)},
      { title: '状态', dataIndex: 'status', key: 'status', render: (status) => {
        switch (status) {
          case WITHDRAW_STATUS.APPLYING:
            return <span style={{color: 'red'}}>等待处理</span>
          case WITHDRAW_STATUS.DONE:
            return <span style={{color: 'green'}}>处理完成</span>
          default:
            return <span>未知状态</span>
        }
      } },
      { title: '到账日期', dataIndex: 'operateDate', key: 'operateDate', render: (operateDate) => (<span>{moment(new Date(operateDate)).format('LLLL')}</span>) }
    ]
    return (
      <Table rowKey="id"
             columns={columns}
             dataSource={this.props.withdrawLogList}
             loading={loading}
      />
    )
  }

  render() {
    return (
      <div>
        {this.renderSearchBar()}
        {this.renderTable()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let withdrawLogList = []
  let withdrawLog = profitSelector.selectWithdrawLog(state)
  withdrawLog.forEach((withdraw) => {
    withdrawLogList.push(orderSelector.selectWithdrawApplyById(state, withdraw))
  })
  return {
    withdrawLogList,
  }
}

const mapDispatchToProps = {
  ...profitAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(WithdrawLog))