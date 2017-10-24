/**
 * Created by lilu on 2017/10/16.
 */
/**
 * Created by lilu on 2017/10/15.
 */
/**
 * Created by lilu on 2017/9/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Row, Col, Input, Select, Button} from 'antd';
import ContentHead from '../../component/ContentHead'
import InvestorAccountList from './InvestorAccountList';
// import StationMenu from './StationMenu'
import {stationAction, stationSelector} from '../station/redux';
import {configSelector} from '../../util/config'
import createBrowserHistory from 'history/createBrowserHistory'
import DivisionCascader from '../../component/DivisionCascader'
import {accountAction,accountSelector} from './redux'
import AccountChart from '../../component/account/AccountChart'
import {action as authAction, selector as authSelector} from '../../util/auth'
import * as excelFuncs from '../../util/excel'
import {PERMISSION_CODE,ROLE_CODE} from '../../util/rolePermission'

const history = createBrowserHistory()
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
      userId: undefined
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

  setStatus() {
    if (this.state.selectedRowId) {
      let data = undefined
      this.props.stations.forEach((item, key)=> {
        if (item.id == this.state.selectedRowId[0]) {
          data = item
        }
      })
      let payload = {
        stationId: this.state.selectedRowId,
        success: ()=> {
          this.refresh()
        },
        error: ()=> {
          console.log('i m false')
        }
      }
      if (data.status == 1) {
        this.props.closeStation(payload)
      } else {
        this.props.openStation(payload)
      }
    }
  }

  statusChange(value) {
    this.setState({status: value})
  }


  search() {
    let payload = {
      stationId: this.state.stationId,
      userId: this.state.userId,
      success: ()=> {
        console.log('success')
      },
      error: ()=> {
        console.log('error')
      }
    }
    this.props.fetchInvestorAccounts(payload)
  }

  clearSearch() {
    this.setState({
      stationId: undefined,
      userId: undefined
    })
    this.props.fetchInvestorAccounts({
      success: ()=> {
        console.log('hahhahah')
      }
    })
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
    let data = [[ "日期",    "利润", "成本" , "收益" , "服务点名称" ],]
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
        <InvestorAccountList selectStation={(rowId, rowData)=> {
          this.selectStation(rowId, rowData)
        }} stationAccounts={this.props.investorAccounts}/>
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let accounts = accountSelector.selectInvestorAccounts(state)
  let userList = authSelector.selectUsersByRole(state,ROLE_CODE.STATION_INVESTOR)
  return {
    investorAccounts: accounts,
    stations: stations,
    userList: userList
    // areaList: areaList,
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction,
  ...authAction

};

export default connect(mapStateToProps, mapDispatchToProps)(InvestorAccountManager);

export {saga, reducer} from './redux';
