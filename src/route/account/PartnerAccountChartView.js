/**
 * Created by lilu on 2017/10/16.
 */
/**
 * Created by lilu on 2017/10/15.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button, DatePicker, Form, message} from 'antd';
import {stationAction, stationSelector} from '../station/redux';
import createBrowserHistory from 'history/createBrowserHistory'
import {accountAction, accountSelector} from './redux'
import AccountChart from '../../component/account/AccountChart'
import {PERMISSION_CODE, ROLE_CODE} from '../../util/rolePermission'
import moment from 'moment'
import {action as authAction, selector as authSelector} from '../../util/auth'
import mathjs from 'mathjs'
const history = createBrowserHistory()
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const ButtonGroup = Button.Group
const FormItem = Form.Item
// var Excel = require('exceljs');

class StationAccountManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curUserId: -1,
      selectedRowId: undefined,
      selectedRowData: undefined,
      status: undefined,
      stationId: undefined,
      division: [],
      startDate: moment().day(-30).format(),
      endDate: moment().format(),
      userId: undefined
    }
  }


  selectPartner(value) {
    this.setState({
      userId: value
    })
  }

  componentWillMount() {

    this.props.listUsersByRole({
      roleCode: ROLE_CODE.STATION_PROVIDER,
      onSuccess: ()=> {
        console.log('this.props.userList[0].id======>', this.props.userList[0].id)
        this.props.fetchPartnerAccountsDetail({
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          userId: this.props.userList[0].id,
          success: ()=> {
            console.log('hahhahah')
          },

        })
      }
    })


  }

  refresh() {
    // this.props.requestStations({...this.state})
  }


  search(e) {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const rangeTimeValue = fieldsValue['rangeTimePicker']
      let values = fieldsValue
      if (rangeTimeValue && rangeTimeValue.length === 2) {
        values = {
          ...fieldsValue,
          'rangeTimePicker': [
            rangeTimeValue[0].format('YYYY-MM-DD'),
            rangeTimeValue[1].format('YYYY-MM-DD'),
          ],
        }
      }
      let dateRange = mathjs.chain(moment(values.rangeTimePicker[1]) - moment(values.rangeTimePicker[0])).multiply(1 / 31536000000).done()
      if(dateRange>2){
        message.error('时间范围请不要超过2年')
      }else{
        let payload = {
          userId: values.userId,
          mobilePhoneNumber: values.mobilePhoneNumber,
          startDate: values.rangeTimePicker ? values.rangeTimePicker[0] : moment().day(-30).formate(),
          endDate: values.rangeTimePicker ? values.rangeTimePicker[1] : moment().formate(),
          success: ()=> {
          },
          error: ()=> {
          }
        }
        this.props.fetchPartnerAccountsDetail(payload)
      }
    })
  }

  selectDate(date, dateString) {
    console.log('date=====>', mathjs.chain(date[1] - date[0]).multiply(1 / 31536000000).done())
    let dateRange = mathjs.chain(date[1] - date[0]).multiply(1 / 31536000000).done()

    if (dateRange > 2) {
      message.error('时间范围请不要超过2年')
    } else {
      this.setState({startDate: dateString[0], endDate: dateString[1]})

    }
  }


  renderSearchBar() {
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form
    return (
      <Form style={{marginTop: 12, marginBottom: 12}} layout="inline" onSubmit={(e)=> {
        this.search(e)
      }}>
        <FormItem>
          {getFieldDecorator("rangeTimePicker", {
            initialValue: [moment().day(-30), moment()],
            rules: [{type: 'array'}],
          })(
            <RangePicker format="YYYY-MM-DD"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("userId", {
            initialValue: this.props.userList&&this.props.userList.length?this.props.userList[0].id:undefined,
          })(
            <Select style={{width: 120}} placeholder="选择分成方">
              {
                this.props.userList.map((user, index) => (
                  <Option key={index} value={user.id}>{user.nickname + '  ' + user.mobilePhoneNumber}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("mobilePhoneNumber", {
          })(
            <Input placeholder = '电话号码' />
          )}
        </FormItem>
        <FormItem>
          <Button.Group>
            <Button onClick={() => {
              this.props.form.resetFields()
            }}>重置</Button>
            <Button type="primary" htmlType="submit">查询</Button>
          </Button.Group> </FormItem>
      </Form>

    )
  }


  render() {
    // console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        {this.renderSearchBar()}
        <AccountChart stationNameList={this.props.stationNameList} profitData={this.props.profitData} yline='profit' xline='accountDay'/>
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let userList = authSelector.selectUsersByRole(state, ROLE_CODE.STATION_PROVIDER)
  let accounts = accountSelector.selectPartnerAccountsDetail(state)
  let stationNameSet = new Set()
  let investProfitMap = new Map()
  let profitData = []
  accounts.forEach((partnerAccount) => {
    stationNameSet.add(partnerAccount.station.name)
    let stationProfit = {stationName: partnerAccount.station.name, profit: partnerAccount.profit}
    let profitMapValue = investProfitMap.get(partnerAccount.accountDay)
    if (!profitMapValue) {
      investProfitMap.set(partnerAccount.accountDay, [stationProfit])
    } else {
      profitMapValue.push(stationProfit)
      investProfitMap.set(partnerAccount.accountDay, profitMapValue)
    }
  })
  for (let dateKey of investProfitMap.keys()) {
    let profitObj = {}
    profitObj.date = dateKey
    for (let stationName of stationNameSet) {
      profitObj[stationName] = 0
    }
    let profitValue = investProfitMap.get(dateKey)
    for (let value of profitValue) {
      profitObj[value.stationName] = value.profit
    }
    profitData.push(profitObj)
  }
  return {
    stationAccounts: accounts,
    userList: userList,
    stationNameList: Array.from(stationNameSet),
    profitData,
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction,
  ...authAction

};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StationAccountManager));

export {saga, reducer} from './redux';
