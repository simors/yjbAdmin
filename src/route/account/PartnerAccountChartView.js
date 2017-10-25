/**
 * Created by lilu on 2017/10/16.
 */
/**
 * Created by lilu on 2017/10/15.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Row, Col, Input, Select, Button,DatePicker} from 'antd';
import ContentHead from '../../component/ContentHead'
import StationAccountList from './StationAccountList';
// import StationMenu from './StationMenu'
import {stationAction, stationSelector} from '../station/redux';
import {configSelector} from '../../util/config'
import createBrowserHistory from 'history/createBrowserHistory'
import DivisionCascader from '../../component/DivisionCascader'
import {accountAction,accountSelector} from './redux'
import AccountChart from '../../component/account/AccountChart'
import {PERMISSION_CODE,ROLE_CODE} from '../../util/rolePermission'
import moment from 'moment'
import {action as authAction, selector as authSelector} from '../../util/auth'

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
      division: [],
      startDate: undefined,
      endDate: undefined,
      userId: undefined
    }
  }

  selectStation(value) {
    this.setState({
      stationId: value
    })
  }

  selectPartner(value){
    this.setState({
      userId: value
    })
  }

  componentWillMount() {

    this.props.fetchPartnerAccountsDetail({
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
    this.props.fetchStationAccountsDetail(payload)
  }


  clearSearch() {
    this.setState({
      status: undefined,
     startDate: undefined,
      endDate: undefined,
      userId: undefined,
      division: []
    })
    this.props.requestStations({
      success: ()=> {
        console.log('hahhahah')
      }
    })
  }

  selectStartDate(date,dateString){
    this.setState({startDate: dateString})
  }

  selectEndDate(date,dateString){
    this.setState({endDate: dateString})
  }


  renderSearchBar() {
    return (
      <div style={{flex: 1}}>
        <Row >
          <Col span={4}>
            <Select defalutValue = '' onChange={(value)=>{this.selectPartner(value)}} style={{width: 120}} placeholder="选择投资人">
              <Option value=''>全部</Option>
              {
                this.props.userList.map((user, index) => (
                  <Option key={index} value={user.id}>{user.nickname+'  '+user.mobilePhoneNumber}</Option>
                ))
              }
            </Select>
          </Col>
          <Col span={4}>
            <DatePicker key='startDate' defaultValue={undefined} value={this.state.startDate?moment(this.state.startDate):undefined} onChange={(date,dateString)=>{this.selectStartDate(date,dateString)}} placeholder="选择开始日期"/>
          </Col>
          <Col span={4}>
            <DatePicker key='endDate' defaultValue={undefined} value={this.state.endDate?moment(this.state.endDate):undefined} onChange={(date,dateString)=>{this.selectEndDate(date,dateString)}} placeholder="选择结束时间"/>
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
        {this.renderSearchBar()}
        <AccountChart data = {this.props.stationAccounts} yline = 'profit' xline = 'accountDay'/>
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let userList = authSelector.selectUsersByRole(state,ROLE_CODE.STATION_INVESTOR)
  let accounts = accountSelector.selectPartnerAccountsDetail(state)
  // let areaList = configSelector.selectAreaList(state)
  console.log('accounts========>', accounts)
  return {
    stationAccounts: accounts,
    userList: userList
    // areaList: areaList,
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction

};

export default connect(mapStateToProps, mapDispatchToProps)(StationAccountManager);

export {saga, reducer} from './redux';
