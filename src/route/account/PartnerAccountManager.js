/**
 * Created by lilu on 2017/10/15.
 */
/**
 * Created by lilu on 2017/9/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button, DatePicker , Form} from 'antd';
import PartnerAccountList from './PartnerAccountList';
import {stationAction, stationSelector} from '../station/redux';
import {accountAction, accountSelector} from './redux'
import * as excelFuncs from '../../util/excel'
import {PERMISSION_CODE, ROLE_CODE} from '../../util/rolePermission'
import moment from 'moment'
import {action as authAction, selector as authSelector} from '../../util/auth'
import mathjs from 'mathjs'
import {withRouter} from 'react-router'

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

  selectType(value) {
    this.setState({selectedType: value})
  }

  downloadFile() {
    let data = [["日期", "利润", "成本", "收益", "服务点名称"],]
    // let accountArray = []
    if (this.props.partnerAccounts && this.props.partnerAccounts.length) {
      this.props.partnerAccounts.forEach((account)=> {
        let account2Arr = [account.accountDay, account.profit, account.cost, account.incoming, account.station.name]
        data.push(account2Arr)
      })
    }
    let params = {data: data, sheetName: '服务点日结数据', fileName: '服务点日结数据'}

    excelFuncs.exportExcel(params)

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
        let payload = {
          stationId: values.stationId,
          userId: values.userId,
          startDate: values.rangeTimePicker ? values.rangeTimePicker[0] : moment().day(-30).formate(),
          endDate: values.rangeTimePicker ? values.rangeTimePicker[1] : moment().formate(),
          success: ()=> {
            console.log('success')
          },
          error: ()=> {
            console.log('error')
          }
        }
        this.setState({viewType: values.selectedType},()=>{
          if (values.selectedType == 'all') {
            this.props.fetchPartnerAccounts(payload)
          } else {
            this.props.fetchPartnerAccountsDetail(payload)
          }
        })
      }
    })
  }

  clearSearch() {
    this.setState({
      stationId: undefined,
      userId: undefined,
      startDate: moment().day(-30).format(),
      endDate: moment().format(),
    }, ()=> {
      if (this.state.selectedType == 'all') {
        this.props.fetchPartnerAccounts({...this.state})
      } else {
        this.props.fetchPartnerAccountsDetail({...this.state})
      }
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
        <FormItem>
          {getFieldDecorator("stationId", {
            initialValue: '',
          })(
            <Select style={{width: 120}} placeholder="选择服务网点">
              <Option value=''>全部</Option>
              {
                this.props.stations.map((station, index) => (
                  <Option key={index} value={station.id}>{station.name}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("userId", {
            initialValue: '',
          })(
            <Select defalutValue='' style={{width: 120}} placeholder="选择分成方">
              <Option value=''>全部</Option>
              {
                this.props.userList.map((user, index) => (
                  <Option key={index} value={user.id}>{user.nickname + '  ' + user.mobilePhoneNumber}</Option>
                ))
              }
            </Select>
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
            this.downloadFile()
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
  ...authAction

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(PartnerAccountManager)));

export {saga, reducer} from './redux';
