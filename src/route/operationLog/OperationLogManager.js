/**
 * Created by lilu on 2017/10/21.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button} from 'antd';
import OperationLogList from './OperationLogList';
// import StationMenu from './StationMenu'
import createBrowserHistory from 'history/createBrowserHistory'
import {selector as operationLogSelector, actions as operationLogActions} from './redux'
import mathjs from 'mathjs'
import {action as authActions, selector as authSelector} from '../../util/auth'

const history = createBrowserHistory()
const Option = Select.Option;
const ButtonGroup = Button.Group
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
      limit: 3
    })
    this.props.listAdminUsers({
      onFailure: (e)=>{console.log('falus=====>',e.message)}
    })
  }

  refresh() {
    this.props.fetchOperationList({...this.state})
  }

  changePageSize(page,pageSize){
    if(this.props.operationLogs&&this.props.operationLogs.length){
      let count = this.props.operationLogs.length
      let pageMax = count/pageSize

      if(page==pageMax|| page>=pageMax){
        let payload = {
          ...this.state,
          lastCreatedAt: this.props.operationLogs[this.props.operationLogs.length-1].createdAt,
          success: ()=> {
          },
          error: ()=> {
          },
          isRefresh: false,
          limit: 3
        }
        this.props.fetchOperationList(payload)
      }
    }

  }

  search() {
    let payload = {
      isRefresh: true ,
      userId: this.state.userId,
      success: ()=> {
        console.log('success')
      },
      error: ()=> {
        console.log('error')
      },
      limit: 3
    }
    this.props.fetchOperationList(payload)
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

  selectAdmin(value){
    this.setState({userId: value})
  }

  renderSearchBar() {
    return (
      <div style={{flex: 1}}>
        <Row >
          <Col span={20}>
            <Select defalutValue = '' onChange={(value)=>{this.selectAdmin(value)}} style={{width: 120}} placeholder="选择操作用户">
              <Option value=''>全部</Option>
              {
                this.props.adminList.map((item, index) => (
                <Option key={index} value={item.id}>{item.nickname}</Option>
              ))
              }
            </Select>
            </Col>
          <Col span={4}>
            <ButtonGroup>
              <Button onClick={()=> {
                this.search()
              }}>查询</Button>
            <Button onClick={()=> {
              this.clearSearch()
            }}>重置</Button>
            </ButtonGroup>
          </Col>
        </Row>

      </div>
    )
  }

  render() {
    // console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        {this.renderSearchBar()}

        <OperationLogList operationLogs={this.props.operationLogs} changePageSize={(page,pageSize)=>{this.changePageSize(page,pageSize)}}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(OperationLogManager);

export {saga, reducer} from './redux';