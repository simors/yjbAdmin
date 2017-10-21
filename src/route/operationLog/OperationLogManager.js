/**
 * Created by lilu on 2017/10/21.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button} from 'antd';
import OperationLogList from './OperationLogList';
// import StationMenu from './StationMenu'
import createBrowserHistory from 'history/createBrowserHistory'
import {selector as operationLogSelector, actions} from './redux'

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
      isRefresh: true
    })
  }

  refresh() {
    this.props.fetchOperationList({...this.state})
  }

  search() {
    let payload = {
      userId: this.state.userId,
      success: ()=> {
        console.log('success')
      },
      error: ()=> {
        console.log('error')
      }
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

  renderSearchBar() {
    return (
      <div style={{flex: 1}}>
        <Row >
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

        <OperationLogList operationLogs={this.props.operationLogs}/>
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let operationLogs = operationLogSelector.selectOperationList(state)
  return {
    operationLogs: operationLogs,
  };
};

const mapDispatchToProps = {
    ...actions,

};

export default connect(mapStateToProps, mapDispatchToProps)(OperationLogManager);

export {saga, reducer} from './redux';
