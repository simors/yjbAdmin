/**
 * Created by lilu on 2017/9/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router'
import {Row, Col, Input, Select, Button, message, Form, Cascader} from 'antd';
import StationList from './StationList';
import StationMenu from './StationMenu'
import {stationAction, stationSelector} from './redux';
import {selector} from '../../util/auth'
import DivisionCascader from '../../component/DivisionCascader'
import {accountAction, accountSelector} from '../account/redux'
import {PERMISSION_CODE} from '../../util/rolePermission'
import {smsAction, smsSelector} from '../../component/smsModal'
import {loadAction} from '../../component/loadActivity'
import {StationStatus} from './index'

const Option = Select.Option;
const ButtonGroup = Button.Group
const FormItem = Form.Item

class StationManage extends React.Component {
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
      division: [],
      modalVisible: false,
      selectedStation: undefined
    }
  }

  selectStation(rowId, rowData) {
    this.setState({selectedRowId: rowId, selectedRowData: rowData}, ()=> {
      console.log('selectRow========>', this.state.selectedRowId)
    })
  }

  componentWillMount() {
    this.props.requestStations({
      success: ()=> {
      }
    });
  }

  refresh() {
    this.props.updateLoadingState({isLoading: false})
    // this.props.requestStations({...this.state})
  }

  setStatus(value) {
    this.props.updateLoadingState({isLoading: true})

    let payload = {
      stationId: value.id,
      success: ()=> {
        // this.setState({modalVisible: false})
        this.props.updateLoadingState({isLoading: false})

        // this.refresh()
      },
      error: (err)=> {
        // this.setState({modalVisible: false})
        this.props.updateLoadingState({isLoading: false})

        message.error(err.message)
      }
    }
    if (value.status == StationStatus.STATION_STATUS_OPEN) {
      this.props.closeStation(payload)
    } else {
      this.props.openStation(payload)
    }
  }


  statusChange(value) {
    this.setState({status: value})
  }

  search(e) {
    e.preventDefault()
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      // console.log('=======>',{...this.props.form.getFieldsValue()})
      let data = this.props.form.getFieldsValue()
      console.log('data=======>', data)
      let payload = {
        province: data.division[0],
        city: data.division[1],
        area: data.division[2],
        status: data.status && data.status.key ? parseInt(data.status.key) : undefined,
        addr: data.addr,
        name: data.name,
        success: ()=> {
          console.log('success')
        },
        error: ()=> {
          console.log('error')
        }
      }
      this.props.requestStations(payload)
      // console.log('data======>',data)
      // let count = this.state.count - 1
    })
  }

  renderSearchBar() {
    const {getFieldDecorator} = this.props.form
    return (
      <Form style={{marginTop: 12, marginBottom: 12}} layout="inline" onSubmit={(e)=> {
        this.search(e)
      }}>
        <FormItem>
          {getFieldDecorator("name", {
            initialValue: '',
          })(
            <Input style={{width: 180}} placeholder='名称'/>)}
        </FormItem>
        <FormItem>
          {getFieldDecorator("status", {})(
            <Select labelInValue={true} placeholder="状态" allowClear={true}
                    style={{width: 120}}>
              <Option value='1'>正常</Option>
              <Option value='0'>已停用</Option>
            </Select>)}
        </FormItem>
        <FormItem>
          {getFieldDecorator("division", {
            initialValue: [],

          })(
            <DivisionCascader cascaderSize='large'/>
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

  openModal(value) {

    let payload = {
      modalVisible: true,
      op: '开关服务点',
      verifySuccess: ()=> {
        this.setStatus(value)
      },
      verifyError: ()=> {
        message.error('验证错误')
      }

    }
    this.props.updateSmsModal(payload)
  }


  render() {
    return (
      <div>
        <StationMenu
          showDetail={()=> {
            if (this.state.selectedRowId && this.state.selectedRowId.length) {
              this.props.history.push({
                pathname: '/site_list/showStation/' + (this.state.selectedRowId ? this.state.selectedRowId[0] : ''),
              })
            }
          }}
          addVisible={this.props.addVisible}
          set={()=> {
            if (this.state.selectedRowId && this.state.selectedRowId.length) {
              this.props.history.push({
                pathname: '/site_list/editStation/' + (this.state.selectedRowId ? this.state.selectedRowId[0] : ''),
              })
            }
          }}
          add={()=> {
            this.props.history.push({pathname: '/site_list/addStation'})
          }}
          setStatus={()=> {
            this.openModal()
          }}
          refresh={()=> {
            this.refresh()
          }}
        />
        {this.renderSearchBar()}

        <StationList
          showStation={(value)=> {
            this.props.history.push({
              pathname: '/site_list/showStation/' + value.id,
            })
          }}
          selectStation={(rowId, rowData)=> {
            this.selectStation(rowId, rowData)
          }}
          stations={this.props.stations}
          editStation={(value)=> {
            this.props.history.push({
              pathname: '/site_list/editStation/' + value.id,
            })
          }}
          setStationStatus={(value)=> {
            this.setStatus(value)
          }}
        />
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let showVisible = selector.selectValidPermissions(state, [PERMISSION_CODE.STATION_BASE_QUERY, PERMISSION_CODE.STATION_QUERY_PARTNER])
  let addVisible = selector.selectValidPermissions(state, [PERMISSION_CODE.STATION_ADD])
  let editVisible = selector.selectValidPermissions(state, [PERMISSION_CODE.STATION_EDIT])
  let stationList = []
  stations.forEach((item)=> {
    stationList.push(item.id)
  })
  console.log('stationList=======>', stationList)
  return {
    stations: stations,
    addVisible: addVisible,
    editVisible: editVisible,
    showVisible: showVisible
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction,
  ...loadAction,
  ...smsAction

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(StationManage)));

export {saga, reducer} from './redux';
