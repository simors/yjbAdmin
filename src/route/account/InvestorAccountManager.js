/**
 * Created by lilu on 2017/10/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Row, Col, Input, Select, Button,DatePicker} from 'antd';
import ContentHead from '../../component/ContentHead'
import InvestorAccountList from './InvestorAccountList';
// import StationMenu from './StationMenu'
import {stationAction, stationSelector} from '../station/redux';
import {configSelector} from '../../util/config'
import DivisionCascader from '../../component/DivisionCascader'
import {accountAction,accountSelector} from './redux'
import AccountChart from '../../component/account/AccountChart'
import {action as authAction, selector as authSelector} from '../../util/auth'
import * as excelFuncs from '../../util/excel'
import {PERMISSION_CODE,ROLE_CODE} from '../../util/rolePermission'
import moment from 'moment'
import mathjs from 'mathjs'
import {withRouter} from 'react-router'

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const ButtonGroup = Button.Group
// var Excel = require('exceljs');

class InvestorAccountManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curUserId: -1,
      selectedRowId: undefined,
      selectedRowData: undefined,
      status: undefined,
      stationId: undefined,
      userId: undefined,
      startDate: moment().day(-30).format(),
      endDate: moment().format(),
      selectedType: 'all',
      viewType: 'all'
    }
  }

  selectStation(value) {
    this.setState({
      stationId: value
    })
  }

  selectInvestor(value){
    this.setState({
      userId: value
    })
  }

  componentWillMount() {

    this.props.fetchInvestorAccounts({
      ...this.state,
      success: ()=> {
        console.log('hahhahah')
      },
    })
    this.props.requestStations({

    })
    this.props.listUsersByRole({roleCode:ROLE_CODE.STATION_INVESTOR})
  }

  refresh() {
    // this.props.requestStations({...this.state})
  }

  search() {

    let payload = {
      stationId: this.state.stationId,
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
    this.setState({viewType:this.state.selectedType},()=>{
      if(this.state.selectedType=='all'){
        this.props.fetchInvestorAccounts(payload)
      }else{
        this.props.fetchInvestorAccountsDetail(payload)
      }
    })

  }

  selectType(value){
    console.log('value----------------',value)
    this.setState({selectedType: value})
  }

  clearSearch() {
    this.setState({
      stationId: undefined,
      userId: undefined,
      startDate: moment().day(-30).format(),
      endDate: moment().format(),
    },()=>{
      if(this.state.selectedType=='all'){
        this.props.fetchInvestorAccounts({...this.state})
      }else{
        this.props.fetchInvestorAccountsDetail(...this.state)
      }
    })

  }

  selectDate(date,dateString){
    let dateRange = mathjs.chain(date[1]- date[0]).multiply(1/31536000000).done()

    if(dateRange>2){
      message.error('时间范围请不要超过2年')
    }else{
      this.setState({startDate: dateString[0],endDate: dateString[1]})

    }
  }

  renderSearchBar() {
    return (
      <div style={{flex: 1}}>
        <Row gutter={24}>
          <Col span={4}>
          <Select defalutValue = '' onChange={(value)=>{this.selectStation(value)}} style={{width: 120}} placeholder="选择服务网点">
            <Option value=''>全部</Option>
            {
              this.props.stations.map((station, index) => (
                <Option key={index} value={station.id}>{station.name}</Option>
              ))
            }
          </Select>
        </Col>
          <Col span={4}>
            <Select defalutValue = '' onChange={(value)=>{this.selectInvestor(value)}} style={{width: 120}} placeholder="选择投资人">
              <Option value=''>全部</Option>
              {
                this.props.userList.map((user, index) => (
                  <Option key={index} value={user.id}>{user.nickname+'  '+user.mobilePhoneNumber}</Option>
                ))
              }
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker key='selectDate' defaultValue={undefined} value={[this.state.startDate?moment(this.state.startDate):undefined,moment(this.state.endDate)]} onChange={(date,dateString)=>{this.selectDate(date,dateString)}} placeholder="选择日期"/>
          </Col>
          <Col span={4}>
            <Select defalutValue = 'all' onChange={(value)=>{this.selectType(value)}} style={{width: 120}} placeholder="选择查询方式">
              <Option value='all'>按周期</Option>
              <Option value='detail'>按日期</Option>
            </Select>
          </Col>
          <Col span={4}>
            <ButtonGroup>
            <Button type='primary' onClick={()=> {
              this.search()
            }}>查询</Button>

            <Button type='primary' onClick={()=> {
              this.clearSearch()
            }}>重置</Button>
              </ButtonGroup>
          </Col>
        </Row>

      </div>
    )
  }

  downloadFile(){
    let data = [[ "服务点名称",    "投资人名称" , "利润" ,"日期"],]
    // let accountArray = []
    if(this.props.investorAccounts&&this.props.investorAccounts.length){
      this.props.investorAccounts.forEach((account)=>{
        let account2Arr = [account.accountDay,account.profit, account.cost,account.incoming,account.station.name]
        data.push(account2Arr)
      })
    }
    let params={data: data, sheetName:'投资人日结数据', fileName:'投资人日结数据'}

    excelFuncs.exportExcel(params)

  }

  viewChart(){
    this.props.history.push({
      pathname: '/settlement_investor/investorChart',
    })
  }

  render() {
    // console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        <ButtonGroup>
          <Button onClick={()=>{this.downloadFile()}}>导出Excel</Button>
          <Button onClick={()=>{this.viewChart()}}>查看图表</Button>
        </ButtonGroup>
        {this.renderSearchBar()}
        {<InvestorAccountList
          viewType = {this.state.viewType}
          investorAccounts={this.state.viewType=='all'?this.props.investorAccounts:this.props.investorAccountsDetail}/>}
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let accounts = accountSelector.selectInvestorAccounts(state)
  let accountsDetail = accountSelector.selectInvestorAccountsDetail(state)
  // console.log('accounts====>',accounts)

  // console.log('accountsDetail====>',accountsDetail)
  let userList = authSelector.selectUsersByRole(state,ROLE_CODE.STATION_INVESTOR)
  return {
    investorAccounts: accounts,
    stations: stations,
    userList: userList,
    investorAccountsDetail: accountsDetail
    // areaList: areaList,
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction,
  ...authAction

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InvestorAccountManager));

export {saga, reducer} from './redux';
