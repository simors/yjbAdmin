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
import {configSelector} from '../../util/config'
import createBrowserHistory from 'history/createBrowserHistory'
import DivisionCascader from '../../component/DivisionCascader'

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
      division: []
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
        console.log('hahhahah')
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
          this.refresh()
        },
        error: ()=> {
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
    this.setState({status: parseInt(value)})
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
      status: this.state.status != undefined ? this.state.status : undefined,
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
          <Col span={4}>
            <p >名称</p>
          </Col>
          <Col span={8}>
            <Input onChange={(e)=> {
              this.setState({name: e.target.value})
            }}></Input>
          </Col>
          <Col span={4}>
            <p>状态</p>
          </Col>
          <Col span={8}>
            <Select allowClear={true} style={{width: 120}} onChange={(value)=> {
              this.statusChange(value)
            }}>
              <Option value='1'>正常</Option>
              <Option value='0'>已停用</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={2}>
            <div>省市区</div>
          </Col>
          <Col span={9}>
            <DivisionCascader
              defaultValue={this.state.division}
              onChange={(key, value)=> {
                this.setDivision(key)
                console.log('value===>', value, key)
              }}
            />
          </Col>
          <Col span={2}>
            <div>地址</div>
          </Col>
          <Col span={7}>
            <Input onChange={(e)=> {
              this.setState({addr: e.target.value})
            }}/>
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


  render() {
    // console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        <StationMenu
          showDetail={()=> {
            this.props.history.push({
              pathname: '/site/showStation/' + (this.state.selectedRowId ? this.state.selectedRowId[0] : ''),
            })
          }}
          set={()=> {
            this.props.history.push({
              pathname: '/site/editStation/' + (this.state.selectedRowId ? this.state.selectedRowId[0] : ''),
            })
          }}
          add={()=>{this.props.history.push({pathname: '/site/addStation'})}}
          setStatus={()=> {
            this.setStatus()
          }}
          refresh={()=> {
            this.refresh()
          }}
        />
        {this.renderSearchBar()}

        <StationList selectStation={(rowId, rowData)=> {
          this.selectStation(rowId, rowData)
        }} stations={this.props.stations}/>
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let areaList = configSelector.selectAreaList(state)
  console.log('areaList========>', areaList)
  return {
    stations: stations,
    areaList: areaList,
  };
};

const mapDispatchToProps = {
  ...stationAction

};

export default connect(mapStateToProps, mapDispatchToProps)(StationManage);

export {saga, reducer} from './redux';
