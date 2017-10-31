/**
 * Created by lilu on 2017/10/15.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button,message,DatePicker,Form} from 'antd';
import {stationAction, stationSelector} from '../station/redux';
import {accountAction,accountSelector} from './redux'
import AccountChart from '../../component/account/StationAccountChart'
import moment from 'moment'
import mathjs from 'mathjs'

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const ButtonGroup = Button.Group
const FormItem = Form.Item

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

      let payload = {
        stationId: values.stationId,
        startDate: values.rangeTimePicker ? values.rangeTimePicker[0] : moment().day(-30).formate(),
        endDate: values.rangeTimePicker ? values.rangeTimePicker[1] : moment().formate(),
        success: ()=> {
          console.log('success')
        },
        error: ()=> {
          console.log('error')
        }
      }
      this.props.fetchStationAccountsDetail(payload)
    })

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
          <Button.Group>
            <Button onClick={() => {
              this.props.form.resetFields()
            }}>重置</Button>
            <Button type="primary" htmlType="submit">查询</Button>
          </Button.Group> </FormItem>
      </Form>

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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StationAccountManager));

export {saga, reducer} from './redux';
