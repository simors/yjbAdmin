/**
 * Created by lilu on 2017/10/15.
 */
/**
 * Created by lilu on 2017/9/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button, DatePicker, Form, message} from 'antd';
import PartnerAccountList from './PartnerAccountList';
import {stationAction, stationSelector} from '../station/redux';
import {accountAction, accountSelector} from './redux'
import * as excelFuncs from '../../util/excel'
import {PERMISSION_CODE, ROLE_CODE} from '../../util/rolePermission'
import moment from 'moment'
import {action as authAction, selector as authSelector} from '../../util/auth'
import mathjs from 'mathjs'
import {withRouter} from 'react-router'
import XLSX from 'xlsx'
import {loadAction} from '../../component/loadActivity'
import StationSelect from '../station/StationSelect'

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const ButtonGroup = Button.Group
const FormItem = Form.Item

class PartnerAccountManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curUserId: -1,
      selectedRowId: undefined,
      selectedRowData: undefined,
      status: undefined,
      stationId: undefined,
      userId: undefined,
      selectedType: 'all',
      startDate: moment().day(-30).format(),
      endDate: moment().format(),
      division: [],
      viewType: 'all'

    }
  }

  selectStation(value) {
    this.setState({
      stationId: value
    })
  }

  selectPartner(value) {
    this.setState({
      userId: value
    })
  }

  componentWillMount() {

    this.props.fetchPartnerAccounts({
      ...this.state,
      success: ()=> {
        console.log('hahhahah')
      },
    })
    this.props.requestStations({})
    this.props.listUsersByRole({
      roleCode: ROLE_CODE.STATION_PROVIDER
    })
  }

  refresh() {
    // this.props.requestStations({...this.state})
  }

  downExcelFile() {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      let values = fieldsValue
      let dateRange = mathjs.chain(values.rangeTimePicker[1] - values.rangeTimePicker[0]).multiply(1 / 31536000000).done()
      if (dateRange > 2) {
        message.error('时间范围请不要超过2年')
      } else {
        let payload = {
          limit: 1000,
          stationId: values.stationId,
          userId: values.userId,
          startDate: values.rangeTimePicker ? values.rangeTimePicker[0].format() : moment().day(-30).format(),
          endDate: values.rangeTimePicker ? values.rangeTimePicker[1].format() : moment().format(),
          success: (data)=> {
            let excelData = [["服务点名称", "分成方信息", "利润", "开始日期", '结束日期'],]
            // let accountArray = []
            if (data && data.length > 0) {

              data.forEach((account)=> {
                let account2Arr = [account.station ? account.station.name : '全服务点', account.user.nickname, account.profit, account.startDate, account.endDate]
                excelData.push(account2Arr)
              })
            }
            this.props.updateLoadingState({isLoading: false})
            let params = {data: excelData, sheetName: '服务单位日结统计数据', fileName: '服务单位日结统计数据'}
            excelFuncs.exportExcel(params)
          },
          error: ()=> {
            console.log('error')
          }
        }
        this.props.exportPartnerExcel(payload)
      }
    })
  }


  downDetailExcelFile() {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      let values = fieldsValue
      let dateRange = mathjs.chain(values.rangeTimePicker[1] - values.rangeTimePicker[0]).multiply(1 / 31536000000).done()
      if (dateRange > 2) {
        message.error('时间范围请不要超过2年')
      } else {
        let payload = {
          limit: 1000,
          stationId: values.stationId,
          userId: values.userId,
          startDate: values.rangeTimePicker ? values.rangeTimePicker[0].format() : moment().day(-30).format(),
          endDate: values.rangeTimePicker ? values.rangeTimePicker[1].format() : moment().format(),
          success: (data)=> {
            let excelData = [["服务点名称", "分成方信息", "利润", '结算日期', "开始日期", '结束日期'],]
            // let accountArray = []
            if (data && data.length > 0) {
              data.forEach((account)=> {
                let account2Arr = [account.station ? account.station.name : '全服务点', account.user.nickname, account.profit, account.accountDay, account.startDate, account.endDate]
                excelData.push(account2Arr)
              })
            }
            this.props.updateLoadingState({isLoading: false})
            let params = {data: excelData, sheetName: '服务单位日结数据', fileName: '服务单位日结数据'}
            excelFuncs.exportExcel(params)
          },
          error: ()=> {
            console.log('error')
          }
        }
        this.props.exportPartnerDetailExcel(payload)
      }
    })
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
      if (dateRange > 2) {
        message.error('时间范围请不要超过2年')
      } else {
        let payload = {
          stationId: values.stationId,
          mobilePhoneNumber: values.mobilePhoneNumber,
          userId: values.userId,
          startDate: values.rangeTimePicker ? values.rangeTimePicker[0] : moment().day(-30).format(),
          endDate: values.rangeTimePicker ? values.rangeTimePicker[1] : moment().format(),
          success: ()=> {
            console.log('success')
          },
          error: ()=> {
            console.log('error')
          }
        }
        this.setState({viewType: values.selectedType}, ()=> {
          if (values.selectedType == 'all') {
            this.props.fetchPartnerAccounts(payload)
          } else {
            this.props.fetchPartnerAccountsDetail(payload)
          }
        })
      }
    })
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
          {getFieldDecorator("stationId", {})(
            <StationSelect placeholder='请选择服务点' disabled={false}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("mobilePhoneNumber", {})(
            <Input placeholder='电话号码'/>
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


  viewChart() {
    this.props.history.push({
      pathname: '/settlement_site/partnerChart',
    })
  }

  render() {
    return (
      <div>
        <ButtonGroup>
          <Button onClick={()=> {
            if (this.state.viewType == 'all') {
              this.downExcelFile()
            } else {
              this.downDetailExcelFile()
            }
          }}>导出EXCEL</Button>
          <Button onClick={()=> {
            this.viewChart()
          }}>查看图表</Button>

        </ButtonGroup>
        {this.renderSearchBar()}

        <PartnerAccountList
          viewType={this.state.viewType}
          stationAccounts={this.state.viewType == 'all' ? this.props.partnerAccounts : this.props.partnerAccountsDetail}/>
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let accounts = accountSelector.selectPartnerAccounts(state)
  let accountsDetail = accountSelector.selectPartnerAccountsDetail(state)
  let userList = authSelector.selectUsersByRole(state, ROLE_CODE.STATION_PROVIDER)

  return {
    partnerAccounts: accounts,
    stations: stations,
    partnerAccountsDetail: accountsDetail,
    userList: userList
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction,
  ...authAction,
  ...loadAction

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(PartnerAccountManager)));

export {saga, reducer} from './redux';
