/**
 * Created by lilu on 2017/10/15.
 */
/**
 * Created by lilu on 2017/9/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Row, Col, Input, Select, Button,DatePicker,message} from 'antd';
import ContentHead from '../../component/ContentHead'
import StationAccountList from './StationAccountList';
// import StationMenu from './StationMenu'
import {stationAction, stationSelector} from '../station/redux';
import {configSelector} from '../../util/config'
import createBrowserHistory from 'history/createBrowserHistory'
import DivisionCascader from '../../component/DivisionCascader'
import {accountAction,accountSelector} from './redux'
import AccountChart from '../../component/account/AccountChart'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import * as excelFuncs from '../../util/excel'
import moment from 'moment'
import mathjs from 'mathjs'
const history = createBrowserHistory()
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const ButtonGroup = Button.Group
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
      startDate: moment().day(-30).format(),
      endDate: moment().format(),
      selectedType: 'all',
      division: [],
      viewType:'all',
    }
  }

  selectStation(value) {
    this.setState({
      stationId: value
    })
  }

  selectType(value){
    this.setState({
      selectedType: value
    })
  }

  selectDate(date,dateString){
    console.log('date=====>',mathjs.chain(date[1]- date[0]).multiply(1/31536000000).done())
    let dateRange = mathjs.chain(date[1]- date[0]).multiply(1/31536000000).done()

    if(dateRange>2){
      message.error('时间范围请不要超过2年')
    }else{
      this.setState({startDate: dateString[0],endDate: dateString[1]})

    }
  }



  componentWillMount() {
    this.props.fetchStationAccounts({
      ...this.state,
      success: ()=> {
        console.log('hahhahah')
      },
    })
    this.props.requestStations({

    })
  }

  refresh() {
    // this.props.requestStations({...this.state})
  }

  search() {
    let payload = {
      stationId: this.state.stationId,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      success: ()=> {
        this.setState({viewType: this.state.selectedType})
        console.log('success')
      },
      error: ()=> {
        console.log('error')
      }
    }
    if(this.state.selectedType=='all'){
      this.props.fetchStationAccounts(payload)
    }else{
      this.props.fetchStationAccountsDetail(payload)
    }
  }

  clearSearch() {
    this.setState({
      stationId: undefined,
      startDate: undefined,
      endDate: undefined,
    })
    if(this.state.selectedType=='all'){
      this.props.fetchStationAccounts({
        success: ()=> {
          console.log('hahhahah')
        }
      })
    }else{
      this.props.fetchStationAccountsDetail({
        success: ()=> {
          console.log('hahhahah')
        }
      })
    }

  }


  renderSearchBar() {
    return (
      <div style={{flex: 1,marginTop:12,marginBottom: 12}}>
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
          <Col span={8}>
            <RangePicker key='selectDate' defaultValue={undefined} value={[this.state.startDate?moment(this.state.startDate):undefined,moment(this.state.endDate)]} onChange={(date,dateString)=>{this.selectDate(date,dateString)}} placeholder="选择开始日期"/>
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
    let data = [[ "日期",    "利润", "成本" , "收益" , "服务点名称" ],]
    // let accountArray = []
    if(this.props.stationAccounts&&this.props.stationAccounts.length){
      this.props.stationAccounts.forEach((account)=>{
        let account2Arr = [account.accountDay,account.profit, account.cost,account.incoming,account.station.name]
        data.push(account2Arr)
      })
    }
    let params={data: data, sheetName:'服务点日结数据', fileName:'服务点日结数据'}

    excelFuncs.exportExcel(params)

}

  viewChart(){
    this.props.history.push({
      pathname: '/settlement_list/stationChart',
    })
  }

  render() {
    // console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        <ButtonGroup>
          <Button onClick={()=>{this.downloadFile()}}>导出EXCEL</Button>
          <Button onClick={()=>{this.viewChart()}}>查看图表</Button>

        </ButtonGroup>
        {/*<StationMenu*/}
          {/*showDetail={()=> {*/}
            {/*this.props.history.push({*/}
              {/*pathname: '/site/showStation/' + (this.state.selectedRowId ? this.state.selectedRowId[0] : ''),*/}
            {/*})*/}
          {/*}}*/}
          {/*set={()=> {*/}
            {/*this.props.history.push({*/}
              {/*pathname: '/site/editStation/' + (this.state.selectedRowId ? this.state.selectedRowId[0] : ''),*/}
            {/*})*/}
          {/*}}*/}
          {/*add={()=>{this.props.history.push({pathname: '/site/addStation'})}}*/}
          {/*setStatus={()=> {*/}
            {/*this.setStatus()*/}
          {/*}}*/}
          {/*refresh={()=> {*/}
            {/*this.refresh()*/}
          {/*}}*/}
        {/*/>*/}
        {this.renderSearchBar()}

        <StationAccountList
          selectStation={(rowId, rowData)=> {
          this.selectStation(rowId, rowData)
        }}
          viewType = {this.state.viewType}
          stationAccounts={this.state.viewType=='all'?this.props.stationAccounts:this.props.stationAccountsDetail}/>
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let accounts = accountSelector.selectStationAccounts(state)
  let accountsDetail = accountSelector.selectStationAccountsDetail(state)
  // let areaList = configSelector.selectAreaList(state)
  console.log('accountsDetail========>', accountsDetail)
  return {
    stationAccounts: accounts,
    stations: stations,
    stationAccountsDetail: accountsDetail
    // areaList: areaList,
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction

};

export default connect(mapStateToProps, mapDispatchToProps)(StationAccountManager);

export {saga, reducer} from './redux';
