/**
 * Created by lilu on 2017/10/16.
 */
/**
 * Created by lilu on 2017/10/15.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button,DatePicker} from 'antd';
import {stationAction, stationSelector} from '../station/redux';
import {accountAction,accountSelector} from './redux'
import AccountChart from '../../component/account/AccountChart'
import {PERMISSION_CODE, ROLE_CODE} from '../../util/rolePermission'
import moment from 'moment'
import {action as authAction, selector as authSelector} from '../../util/auth'

const Option = Select.Option;
const ButtonGroup = Button.Group
const RangePicker = DatePicker.RangePicker;

class InvestorAccountChartView extends React.Component {
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

  selectInvestor(value) {
    this.setState({
      userId: value
    })
  }

  componentWillMount() {

    this.props.listUsersByRole({
      roleCode: ROLE_CODE.STATION_INVESTOR,
      onSuccess: ()=> {
        console.log('this.props.userList[0].id======>', this.props.userList[0].id)
        this.props.fetchInvestorAccountsDetail({
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


  search() {
    let payload = {
      userId: this.state.userId,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      success: ()=> {
        console.log('success')
      },
      error: ()=> {
        console.log('error')
      }
    }
    this.props.fetchInvestorAccountsDetail(payload)
  }

  setDivision(value) {
    if (value && value.length) {
      this.setState({
        division: value
      }, ()=> {
        console.log('state', this.state.division)
      })
    }
  }

  clearSearch() {
    this.setState({
      status: undefined,
      startDate: moment().day(-30).format(),
      endDate: moment().format(),
      userId: undefined,
      division: []
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
    return (
      <div style={{flex: 1}}>
        <Row >
          <Col span={4}>
            <Select defalutValue='' onChange={(value)=> {
              this.selectInvestor(value)
            }} style={{width: 120}} placeholder="选择分成方">
              <Option value=''>全部</Option>
              {
                this.props.userList.map((user, index) => (
                  <Option key={index} value={user.id}>{user.nickname + '  ' + user.mobilePhoneNumber}</Option>
                ))
              }
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker key='selectDate' defaultValue={undefined}
                         value={[this.state.startDate ? moment(this.state.startDate) : undefined, moment(this.state.endDate)]}
                         onChange={(date, dateString)=> {
                           this.selectDate(date, dateString)
                         }} placeholder="选择日期"/>
          </Col>
          <Col span={2}>
            <Button onClick={()=> {
              this.search()
            }}>查询</Button>
          </Col>
          <Col span={2}>
            <Button onClick={()=> {
              this.clearSearch()
            }}>重置</Button>
          </Col>
        </Row>
      </div>
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
  let userList = authSelector.selectUsersByRole(state, ROLE_CODE.STATION_INVESTOR)
  let accounts = accountSelector.selectInvestorAccountsDetail(state)
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
    stationNameList: Array.from(stationNameSet),
    profitData,
    userList: userList,
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction,
  ...authAction


};

export default connect(mapStateToProps, mapDispatchToProps)(InvestorAccountChartView);

export {saga, reducer} from './redux';
