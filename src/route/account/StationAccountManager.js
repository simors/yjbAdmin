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
import StationAccountList from './StationAccountList';
// import StationMenu from './StationMenu'
// import {stationAction, stationSelector} from './redux';
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
      province: undefined,
      city: undefined,
      area: undefined,
      addr: undefined,
      name: undefined,
      division: []
    }
  }

  selectStation(rowId, rowData) {
    this.setState({selectedRowId: rowId, selectedRowData: rowData}, ()=> {
      console.log('selectRow========>', this.state.selectedRowId)
    })
  }

  componentWillMount() {

    this.props.fetchStationAccountsDetail({
      success: ()=> {
        console.log('hahhahah')
      },
      stationId: '59bc9eea61ff4b547868526a'
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

  search() {
    let payload = {
      province: this.state.division[0],
      city: this.state.division[1],
      area: this.state.division[2],
      status: this.state.status&&this.state.status.key ? parseInt(this.state.status.key) : undefined,
      addr: this.state.addr,
      name: this.state.name,
      success: ()=> {
        console.log('success')
      },
      error: ()=> {
        console.log('error')
      }
    }
    this.props.requestStations(payload)
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
            <Input  placeholder='名称' value={this.state.name} onChange={(e)=> {
              this.setState({name: e.target.value})
            }}></Input>
          </Col>
          <Col span={12}>
            <Select labelInValue={true} placeholder="状态" value={this.state.status}  allowClear={true} style={{width: 120}} onChange={(value)=> {
              this.statusChange(value)
            }}>
              <Option value='1' >正常</Option>
              <Option value='0' >已停用</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <DivisionCascader
              value = {this.state.division}
              defaultValue={this.state.division}
              onChange={(key, value)=> {
                this.setDivision(key)
                console.log('value===>', value, key)
              }}
            />
          </Col>
          <Col span={14}>
            <Input value = {this.state.addr} placeholder='地址' onChange={(e)=> {
              this.setState({addr: e.target.value})
            }}/>
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
    let data = [
      {profit:100,stationId:1},
      {profit:12,stationId:2},
      {profit:33,stationId:3},
      {profit:44,stationId:4},
      {profit:88,stationId:5},
      {profit:121,stationId:6},
      {profit:155,stationId:7},
      {profit:22,stationId:8},
      {profit:31,stationId:9},
      {profit:133,stationId:10}

    ]
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
        {/*{this.renderSearchBar()}*/}

        <StationAccountList selectStation={(rowId, rowData)=> {
          this.selectStation(rowId, rowData)
        }} stationAccounts={this.props.stationAccounts}/>
        <AccountChart data = {this.props.stationAccounts} yline = 'profit' xline = 'accountDay'/>
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  // let stations = stationSelector.selectStations(state)
  let accounts = accountSelector.selectStationAccounts(state)
  // let areaList = configSelector.selectAreaList(state)
  console.log('accounts========>', accounts)
  return {
    stationAccounts: accounts,
    // areaList: areaList,
  };
};

const mapDispatchToProps = {
  // ...stationAction,
  ...accountAction

};

export default connect(mapStateToProps, mapDispatchToProps)(StationAccountManager);

export {saga, reducer} from './redux';
