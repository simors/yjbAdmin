/**
 * Created by lilu on 2017/10/15.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button,message,DatePicker} from 'antd';
import {stationAction, stationSelector} from '../station/redux';
import {accountAction,accountSelector} from './redux'
import AccountChart from '../../component/account/StationAccountChart'
import moment from 'moment'
import mathjs from 'mathjs'

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const ButtonGroup = Button.Group

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
    }
  }

  selectStation(value) {
    this.setState({
      stationId: value
    })
  }

  componentWillMount() {

    this.props.fetchStationAccountsDetail({
      startDate: this.state.startDate,
      endDate: this.state.endDate,
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
      startDate: moment().day(-30).format(),
      endDate: moment().format(),
      stationId:undefined,
      division: []
    })
    this.props.fetchStationAccountsDetail({...this.state})
  }

  renderSearchBar() {
    return (
      <div style={{flex: 1}}>
        <Row >
          <Col span={4}>
            <Select defalutValue = 'all' onChange={(value)=>{this.selectStation(value)}} style={{width: 180}} placeholder="选择服务网点">
              <Option value="all">全部</Option>
              {
                this.props.stations.map((station, index) => (
                  <Option key={index} value={station.id}>{station.name}</Option>
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

  selectDate(date, dateString) {
    let dateRange = mathjs.chain(date[1] - date[0]).multiply(1 / 31536000000).done()

    if (dateRange > 2) {
      message.error('时间范围请不要超过2年')
    } else {
      this.setState({startDate: dateString[0], endDate: dateString[1]})

    }
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
  let stations = stationSelector.selectStations(state)
  let accounts = accountSelector.selectStationAccountsDetail(state)
  return {
    stationAccounts: accounts,
    stations: stations
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction

};

export default connect(mapStateToProps, mapDispatchToProps)(StationAccountManager);

export {saga, reducer} from './redux';
