/**
 * Created by lilu on 2017/10/16.
 */
/**
 * Created by lilu on 2017/10/15.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Row, Col, Input, Select, Button} from 'antd';
import ContentHead from '../../component/ContentHead'
import StationAccountList from './StationAccountList';
// import StationMenu from './StationMenu'
import {stationAction, stationSelector} from '../station/redux';
import {configSelector} from '../../util/config'
import createBrowserHistory from 'history/createBrowserHistory'
import DivisionCascader from '../../component/DivisionCascader'
import {accountAction,accountSelector} from './redux'
import AccountChart from '../../component/account/AccountChart'

const history = createBrowserHistory()
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
      division: []
    }
  }

  selectStation(value) {
    this.setState({
      stationId: value
    })
  }

  componentWillMount() {

    this.props.fetchPartnerAccountsDetail({
      userId:'59be24ddac502e00601af692',
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
      success: ()=> {
        console.log('success')
      },
      error: ()=> {
        console.log('error')
      }
    }
    this.props.fetchStationAccountsDetail(payload)
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
      province: undefined,
      city: undefined,
      area: undefined,
      addr: undefined,
      name: undefined,
      division: []
    })
    this.props.requestStations({
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
            <Select defalutValue = 'all' onChange={(value)=>{this.selectStation(value)}} style={{width: 120}} placeholder="选择服务网点">
              <Option value="all">全部</Option>
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

  downloadFile(fileName, content){
    // var workbook = new Excel.Workbook();
    // // var workbook = createAndFillWorkbook();
    // workbook.xlsx.writeFile('hahahah')
    //   .then(function(item) {
    //     console.log('hahahah=>',item)
    //     // done
    //   });
  }

  render() {
    // console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        <ButtonGroup>
          <Button onClick={()=>{this.downloadFile()}}>ceshi</Button>
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

        <AccountChart data = {this.props.stationAccounts} yline = 'profit' xline = 'accountDay'/>
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let accounts = accountSelector.selectPartnerAccountsDetail(state)
  // let areaList = configSelector.selectAreaList(state)
  console.log('accounts========>', accounts)
  return {
    stationAccounts: accounts,
    stations: stations
    // areaList: areaList,
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction

};

export default connect(mapStateToProps, mapDispatchToProps)(StationAccountManager);

export {saga, reducer} from './redux';
