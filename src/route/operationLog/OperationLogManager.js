/**
 * Created by lilu on 2017/10/21.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button, Form, DatePicker} from 'antd';
import OperationLogList from './OperationLogList';
// import StationMenu from './StationMenu'
import {selector as operationLogSelector, actions as operationLogActions} from './redux'
import mathjs from 'mathjs'
import {action as authActions, selector as authSelector} from '../../util/auth'
import moment from 'moment'

const Option = Select.Option;
const ButtonGroup = Button.Group
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker;

// var Excel = require('exceljs');

class OperationLogManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined
    }
  }


  componentWillMount() {
    this.props.fetchOperationList({
      isRefresh: true,
      limit: 10
    })
    this.props.listAdminUsers({
      onFailure: (e)=> {
        console.log('falus=====>', e.message)
      }
    })
  }

  refresh() {
    this.props.fetchOperationList({...this.state})
  }

  changePageSize(page, pageSize) {
    if (this.props.operationLogs && this.props.operationLogs.length) {
      let count = this.props.operationLogs.length
      let pageMax = count / pageSize

      if (page == pageMax || page >= pageMax) {
        let payload = {
          ...this.state,
          lastCreatedAt: this.props.operationLogs[this.props.operationLogs.length - 1].createdAt,
          success: ()=> {
          },
          error: ()=> {
          },
          isRefresh: false,
          limit: 10
        }
        this.props.fetchOperationList(payload)
      }
    }

  }

  search(e) {
    e.preventDefault()
    this.props.updateLoadingState({isLoading: true})
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      let data = this.props.form.getFieldsValue()
      let payload = {
        isRefresh: true,
        userId: data.userId,
        startDate: data.rangeTimePicker ? data.rangeTimePicker[0].format() : moment().day(-30).format(),
        endDate: data.rangeTimePicker ? data.rangeTimePicker[1].format() : moment().format(),
        success: ()=> {
          console.log('success')
        },
        error: ()=> {
          console.log('error')
        },
        limit: 10
      }
      this.props.fetchOperationList(payload)
    })
  }

  clearSearch() {
    this.setState({
      userId: undefined
    })
    this.props.fetchOperationList({
      success: ()=> {
        console.log('hahhahah')
      }
    })
  }

  selectAdmin(value) {
    this.setState({userId: value})
  }


  renderSearchBar() {
    const {getFieldDecorator} = this.props.form
    return (
      <Form style={{marginTop: 12, marginBottom: 12}} layout="inline" onSubmit={(e)=> {
        this.search(e)
      }}>
        <FormItem>
          {getFieldDecorator("userId", {
            initialValue: '',
          })(
            <Select style={{width: 120}} placeholder="选择操作用户">
              <Option value=''>全部</Option>
              {
                this.props.adminList.map((item, index) => (
                  <Option key={index} value={item.id}>{item.nickname + '' + item.mobilePhoneNumber}</Option>
                ))
              }
            </Select>)}
        </FormItem>
        <FormItem>
          {getFieldDecorator("rangeTimePicker", {
            initialValue: [moment().day(-30), moment()],
            rules: [{type: 'array'}],
          })(
            <RangePicker format="YYYY-MM-DD"/>
          )}
        </FormItem>
        <FormItem>
          <Button.Group>
            <Button onClick={() => {
              this.props.form.resetFields()
            }}>重置</Button>
            <Button type="primary" htmlType="submit">查询</Button>
          </Button.Group>
        </FormItem>
      </Form>

    )
  }


  render() {
    // console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        {this.renderSearchBar()}

        <OperationLogList operationLogs={this.props.operationLogs} changePageSize={(page, pageSize)=> {
          this.changePageSize(page, pageSize)
        }}/>
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let operationLogs = operationLogSelector.selectOperationList(state)
  let adminList = authSelector.selectAdminUsers(state)
  return {
    operationLogs: operationLogs,
    adminList: adminList
  };
};

const mapDispatchToProps = {
  ...operationLogActions,
  ...authActions

};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(OperationLogManager));

export {saga, reducer} from './redux';
