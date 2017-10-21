/**
 * Created by lilu on 2017/9/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Row, Col, Input, Select, Button} from 'antd';
import ContentHead from '../../component/ContentHead'
import StationList from './StationList';
import StationMenu from './StationMenu'
import {stationAction, stationSelector} from './redux';
import {action, selector} from '../../util/auth'
import {configSelector} from '../../util/config'
import createBrowserHistory from 'history/createBrowserHistory'
import DivisionCascader from '../../component/DivisionCascader'
import {accountAction, accountSelector} from '../account/redux'
import {PERMISSION_CODE} from '../../util/rolePermission'
import SmsModal from '../../component/SmsModal'

const history = createBrowserHistory()
const Option = Select.Option;
const ButtonGroup = Button.Group

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
      modalVisible: false
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
          this.setState({modalVisible: false})
          this.refresh()
        },
        error: ()=> {
          this.setState({modalVisible: false})
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
      status: this.state.status && this.state.status.key ? parseInt(this.state.status.key) : undefined,
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
            <Input placeholder='名称' value={this.state.name} onChange={(e)=> {
              this.setState({name: e.target.value})
            }}></Input>
          </Col>
          <Col span={12}>
            <Select labelInValue={true} placeholder="状态" value={this.state.status} allowClear={true}
                    style={{width: 120}} onChange={(value)=> {
              this.statusChange(value)
            }}>
              <Option value='1'>正常</Option>
              <Option value='0'>已停用</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <DivisionCascader
              value={this.state.division}
              defaultValue={this.state.division}
              onChange={(key, value)=> {
                this.setDivision(key)
                console.log('value===>', value, key)
              }}
            />
          </Col>
          <Col span={14}>
            <Input value={this.state.addr} placeholder='地址' onChange={(e)=> {
              this.setState({addr: e.target.value})
            }}/>
          </Col>
          <Col span={5}>
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

  openModal() {
    console.log('hahahahahahha')
    this.setState({modalVisible: true})
  }


  render() {
    // console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        <StationMenu
          showDetail={()=> {
            if (this.state.selectedRowId && this.state.selectedRowId.length) {
              this.props.history.push({
                pathname: '/site/showStation/' + (this.state.selectedRowId ? this.state.selectedRowId[0] : ''),
              })
            }
          }}
          showVisible={this.props.showVisible}
          editVisible={this.props.editVisible}
          addVisible={this.props.addVisible}
          set={()=> {
            if (this.state.selectedRowId && this.state.selectedRowId.length) {
              this.props.history.push({
                pathname: '/site/editStation/' + (this.state.selectedRowId ? this.state.selectedRowId[0] : ''),
              })
            }
          }}
          add={()=> {
            this.props.history.push({pathname: '/site/addStation'})
          }}
          setStatus={()=> {
            this.openModal()
          }}
          refresh={()=> {
            this.refresh()
          }}
        />
        {this.renderSearchBar()}

        <StationList selectStation={(rowId, rowData)=> {
          this.selectStation(rowId, rowData)
        }} stations={this.props.stations}/>
        {this.state.modalVisible ? <SmsModal
          onCancel = {()=>{this.setState({modalVisible: false})}}
          onOk={()=> {this.setStatus()}}
          op='开关服务点'
          error = {(e)=>{console.log(e.message)}}
        /> : null}
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let showVisible = selector.selectValidPermissions(state, [PERMISSION_CODE.STATION_QUERY_WHOLE, PERMISSION_CODE.STATION_QUERY_PART])
  let addVisible = selector.selectValidPermissions(state, [PERMISSION_CODE.STATION_ADD_WHOLE, PERMISSION_CODE.STATION_ADD_PART])
  let editVisible = selector.selectValidPermissions(state, [PERMISSION_CODE.STATION_EDIT_WHOLE, PERMISSION_CODE.STATION_EDIT_PART])
  console.log('showVisible,showVisible', showVisible, addVisible, editVisible)

  return {
    stations: stations,
    addVisible: true,
    editVisible: true,
    showVisible: true
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...accountAction

};

export default connect(mapStateToProps, mapDispatchToProps)(StationManage);

export {saga, reducer} from './redux';
