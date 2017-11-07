/**
 * Created by lilu on 2017/10/15.
 */
/**
 * Created by lilu on 2017/9/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button, DatePicker, message, Form} from 'antd';
import StationAccountList from './StationAccountList';
import {stationAction, stationSelector} from '../station/redux';
import {accountAction, accountSelector} from './redux'
import * as excelFuncs from '../../util/excel'
import moment from 'moment'
import mathjs from 'mathjs'
import {withRouter} from 'react-router'
import XLSX from 'xlsx'
import {loadAction} from '../../component/loadActivity'
import StationSelect from '../station/StationSelect'

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
      startDate: moment().day(-30).format(),
      endDate: moment().format(),
      selectedType: 'all',
      division: [],
      viewType: 'all',
    }
  }

  selectStation(value) {
    this.setState({
      stationId: value
    })
  }

  selectType(value) {
    this.setState({
      selectedType: value
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


  componentWillMount() {
    this.props.fetchStationAccounts({
      ...this.state,
      success: ()=> {
        console.log('hahhahah')
      },
    })
    this.props.requestStations({})
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
      console.log('==============value------->', values)
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
        this.props.updateLoadingState({isLoading: true})
        let payload = {
          stationId: values.stationId,
          startDate: values.rangeTimePicker ? values.rangeTimePicker[0] : moment().day(-30).format(),
          endDate: values.rangeTimePicker ? values.rangeTimePicker[1] : moment().format(),
          success: ()=> {
            this.props.updateLoadingState({isLoading: false})
            console.log('success')
          },
          error: ()=> {
            console.log('error')
          }
        }
        this.setState({viewType: values.selectedType}, ()=> {
          if (values.selectedType == 'all') {
            this.props.fetchStationAccounts(payload)
          } else {
            this.props.fetchStationAccountsDetail(payload)
          }
        })
      }
    })
  }

  clearSearch() {
    this.setState({
      stationId: undefined,
      startDate: moment().day(-30).format(),
      endDate: moment().format(),
    })
    if (this.state.selectedType == 'all') {
      this.props.fetchStationAccounts({
        ...this.state,
        success: ()=> {
          console.log('hahhahah')
        }
      })
    } else {
      this.props.fetchStationAccountsDetail({
        ...this.state,
        success: ()=> {
          console.log('hahhahah')
        }
      })
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
        <FormItem  >
          {getFieldDecorator("stationId", {
          })(
            <StationSelect placeholder='请选择服务点' disabled={false}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("selectedType", {
            initialValue: 'all',
          })(
            <Select style={{width: 120}} placeholder="选择查询方式">
              <Option value='all'>按周期</Option>
              <Option value='detail'>按日期</Option>
            </Select>
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

  downExcelFile(wb,lastCreatedAt){
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      let values = fieldsValue
      let dateRange = mathjs.chain(values.rangeTimePicker[1] - values.rangeTimePicker[0]).multiply(1 / 31536000000).done()
      if(dateRange>2){
        message.error('时间范围请不要超过2年')
      }else{
        let payload = {
          limit: 10,
          stationId: values.stationId,
          startDate: values.rangeTimePicker ? values.rangeTimePicker[0].format() : moment().day(-30).format(),
          endDate: values.rangeTimePicker ? values.rangeTimePicker[1].format() : moment().format(),
          lastCreatedAt: lastCreatedAt,
          success: (data)=> {
            if(data&&data.length>0){
              let excelData = [[  "服务点名称", "收益", "成本","利润",'平台利润','服务单位利润','投资人利润','统计开始日期','统计结束日期'],]
              // let accountArray = []
                data.forEach((account)=> {
                  let account2Arr = [account.station?account.station.name:'全平台', account.incoming, account.cost, account.profit,account.platformProfit,account.partnerProfit,account.investorProfit,account.startDate,account.endDate]
                  excelData.push(account2Arr)
                })

              let lastCreatedAt = data[data.length-1].station.createdAt
              let params = {
                wb:wb,
                data: excelData,
                sheetName: moment(lastCreatedAt).format('YYYY-MM-DD')
              }
              this.props.updateLoadingState({isLoading: true})

              excelFuncs.addExcel(params)
              this.downExcelFile(wb,lastCreatedAt)
            }else{
              this.props.updateLoadingState({isLoading: false})

              excelFuncs.exportExcelNew({wb:wb,fileName:'服务点日结数据'})
            }
          },
          error: ()=> {
            console.log('error')
          }
        }
         this.props.exportStationExcel(payload)
      }
    })
  }


  downDetailExcelFile(wb,lastCreatedAt){
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      let values = fieldsValue
      let dateRange = mathjs.chain(values.rangeTimePicker[1] - values.rangeTimePicker[0]).multiply(1 / 31536000000).done()
      if(dateRange>2){
        message.error('时间范围请不要超过2年')
      }else{
        let payload = {
          limit: 10,
          stationId: values.stationId,
          startDate: values.rangeTimePicker ? values.rangeTimePicker[0].format() : moment().day(-30).format(),
          endDate: values.rangeTimePicker ? values.rangeTimePicker[1].format() : moment().format(),
          lastCreatedAt: lastCreatedAt,
          success: (data)=> {
            if(data&&data.length>0){
              let excelData = [[  "服务点名称","日期", "收益", "成本","利润",'平台利润','服务单位利润','投资人利润','统计开始日期','统计结束日期'],]
              // let accountArray = []
              data.forEach((account)=> {
                let account2Arr = [account.station?account.station.name:'全平台', account.accountDay, account.incoming, account.cost, account.profit,account.platformProfit,account.partnerProfit,account.investorProfit,account.startDate,account.endDate]
                excelData.push(account2Arr)
              })
              let lastCreatedAt = data[data.length-1].createdAt
              let params = {
                wb:wb,
                data: excelData,
                sheetName:  moment(lastCreatedAt).format('YYYY-MM-DD')
              }
              console.log('params=========>',params)
              this.props.updateLoadingState({isLoading: true})

              excelFuncs.addExcel(params)
              this.downDetailExcelFile(wb,lastCreatedAt)
            }else{
              this.props.updateLoadingState({isLoading: false})

              excelFuncs.exportExcelNew({wb:wb,fileName:'服务点日结详情数据'})
            }
          },
          error: ()=> {
            console.log('error')
          }
        }
        this.props.exportStationDetailExcel(payload)
      }
    })
  }

  viewChart() {
    this.props.history.push({
      pathname: '/settlement_list/stationChart',
    })
  }

  render() {
    // console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        <ButtonGroup>
          <Button onClick={()=> {
            let wb = XLSX.utils.book_new();
            if(this.state.viewType=='all'){
              this.downExcelFile(wb)
            }else{
              this.downDetailExcelFile(wb)
            }
          }}>导出EXCEL</Button>
          <Button onClick={()=> {
            this.viewChart()
          }}>查看图表</Button>

        </ButtonGroup>
        {this.renderSearchBar()}
        <StationAccountList
          selectStation={(rowId, rowData)=> {
            this.selectStation(rowId, rowData)
          }}
          viewType={this.state.viewType}
          stationAccounts={this.state.viewType == 'all' ? this.props.stationAccounts : this.props.stationAccountsDetail}/>
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let accounts = accountSelector.selectStationAccounts(state)
  let accountsDetail = accountSelector.selectStationAccountsDetail(state)
  return {
    stationAccounts: accounts,
    stations: stations,
    stationAccountsDetail: accountsDetail
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction,
  ...loadAction

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(StationAccountManager)));

export {saga, reducer} from './redux';
