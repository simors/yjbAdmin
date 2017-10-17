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
import PartnerAccountList from './PartnerAccountList';
// import StationMenu from './StationMenu'
import {stationAction, stationSelector} from '../station/redux';
import {configSelector} from '../../util/config'
import createBrowserHistory from 'history/createBrowserHistory'
import DivisionCascader from '../../component/DivisionCascader'
import {accountAction,accountSelector} from './redux'
import AccountChart from '../../component/account/AccountChart'
import * as excelFuncs from '../../util/excel'

const history = createBrowserHistory()
const Option = Select.Option;
const ButtonGroup = Button.Group
// var Excel = require('exceljs');

class PartnerAccountManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curUserId: -1,
      selectedRowId: undefined,
      selectedRowData: undefined,
      status: undefined,
      stationId: undefined,
      division: []
    }
  }

  selectStation(value) {
    this.setState({
      stationId: value
    })
  }

  componentWillMount() {

    this.props.fetchPartnerAccounts({
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


  areaList() {
    if (this.state.city && this.state.city.sub.length > 0) {
      let areaList = this.state.city.sub.map((item, key)=> {
        return <Option key={key} value={key}>{item.area_name}</Option>
      })
      return areaList
    } else {
      return null
    }
  }

  downloadFile(){
    let data = [[ "日期",    "利润", "成本" , "收益" , "服务点名称" ],]
    // let accountArray = []
    if(this.props.partnerAccounts&&this.props.stationAccounts.length){
      this.props.stationAccounts.forEach((account)=>{
        let account2Arr = [account.accountDay,account.profit, account.cost,account.incoming,account.station.name]
        data.push(account2Arr)
      })
    }
    let params={data: data, sheetName:'服务点日结数据', fileName:'服务点日结数据'}

    excelFuncs.exportExcel(params)

  }

  search() {
    let payload = {
      stationId: this.state.stationId,
      success: ()=> {
        console.log('success')
      },
      error: ()=> {
        console.log('error')
      }
    }
    this.props.fetchPartnerAccounts(payload)
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
      stationId: undefined
    })
    this.props.fetchPartnerAccounts({
      success: ()=> {
        console.log('hahhahah')
      }
    })
  }

  renderSearchBar() {
    return (
      <div style={{flex: 1}}>
        <Row >
          <Col span={12}>
            <Select defalutValue = '' onChange={(value)=>{this.selectStation(value)}} style={{width: 120}} placeholder="选择服务网点">
              <Option value=''>全部</Option>
              {
                this.props.stations.map((station, index) => (
                  <Option key={index} value={station.id}>{station.name}</Option>
                ))
              }
            </Select>
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


  viewChart(){
    this.props.history.push({
      pathname: '/settlement/partnerChart',
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

        <PartnerAccountList selectStation={(rowId, rowData)=> {
          this.selectStation(rowId, rowData)
        }} stationAccounts={this.props.partnerAccounts}/>
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let accounts = accountSelector.selectPartnerAccounts(state)
  // let areaList = configSelector.selectAreaList(state)
  console.log('accounts========>', accounts)
  return {
    partnerAccounts: accounts,
    stations: stations
    // areaList: areaList,
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction

};

export default connect(mapStateToProps, mapDispatchToProps)(PartnerAccountManager);

export {saga, reducer} from './redux';
