/**
 * Created by lilu on 2017/9/21.
 */
/**
 * Created by lilu on 2017/9/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button, message} from 'antd';
import ContentHead from '../../component/ContentHead'
import InvestorList from './InvestorList';
import StationMenu from './StationMenu'
import {stationAction, stationSelector} from './redux';
import {configSelector} from '../../util/config'
import CreateInvestorModal from '../../component/station/CreateInvestorModal'
import UpdateInvestorModal from '../../component/station/UpdateInvestorModal'
import {selector, action} from '../../util/auth'
import StationSelect from './StationSelect'
import LoadActivity, {loadAction} from '../../component/loadActivity'
import {ROLE_CODE,PERMISSION_CODE} from '../../util/rolePermission'

const Option = Select.Option;
const ButtonGroup = Button.Group

class InvestorManage extends React.Component {
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
      createModalVisible: false,
      updateModalVisible: false,
      selectedInvestor: undefined,
      modalKey: -1
    }
  }

  selectInvestor(rowId, rowData) {
    this.setState({selectedRowId: rowId, selectedRowData: rowData}, ()=> {
    })
  }

  componentWillMount() {
    this.props.requestInvestors({
      success: ()=> {
      }
    });
    this.props.requestStations({
      success: ()=> {
      }
    });
    this.props.listUsersByRole({
      roleCode: ROLE_CODE.STATION_INVESTOR,
    });
  }

  refresh() {
    this.props.updateLoadingState({isLoading: true})
    this.props.requestInvestors({...this.state,success: ()=>{    this.props.updateLoadingState({isLoading: false})
    }})
  }

  setStatus(value) {
      let payload = {
        investorId: value.id,
        success: ()=> {
          this.refresh()
        },
        error: (err)=> {
          console.log('i m false', err.message)
        }
      }
      if (value.status == 1) {
        this.props.closeInvestor(payload)
      } else {
        this.props.openInvestor(payload)
      }

  }

  statusChange(value) {
    this.setState({status: parseInt(value)})
  }

  search() {
    this.props.updateLoadingState({isLoading: true})
    let payload = {
      status: this.state.status != undefined ? this.state.status : undefined,
      stationId: this.state.stationId,
      success: ()=> {
        this.props.updateLoadingState({isLoading: false})
        console.log('success')
      },
      error: ()=> {
        this.props.updateLoadingState({isLoading: false})
        console.log('error')
      }
    }
    this.props.requestInvestors(payload)
  }


  selectStation(value){
    this.setState({
      stationId: value
    })
  }

  clearSearch() {
    this.setState({
      status: undefined,
      stationId: undefined,
    })
    this.props.updateLoadingState({isLoading: true})

    this.props.requestStations({
      success: ()=> {
      this.props.updateLoadingState({isLoading: false})
      console.log('success')
    },
      error: ()=> {
        this.props.updateLoadingState({isLoading: false})
        console.log('error')
      }})

  }

  renderSearchBar() {
    return (
      <div style={{flex: 1}}>
        <Row gutter={24}>
          <Col span={4}>
            <Select allowClear={true} style={{width: 120}} placeholder='状态' onChange={(value)=> {
              this.statusChange(value)
            }}>
              <Option value='1'>正常</Option>
              <Option value='0'>已停用</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select style={{width: 120}} placeholder="选择服务网点" onChange={(value)=>{this.selectStation(value)}}>
              <Option value="">全部</Option>
              {
                this.props.stations.map((station, index) => (
                  <Option key={index} value={station.id}>{station.name}</Option>
                ))
              }
            </Select>
            </Col>
          <Col span={4}>
            <ButtonGroup>
            <Button type="primary" onClick={()=> {
              this.search()
            }}>查询</Button>
            <Button type="primary" onClick={()=> {
              this.clearSearch()
            }}>重置</Button>
                        </ButtonGroup>
          </Col>
        </Row>

      </div>
    )
  }

  openCreateModal() {
    this.props.requestStations({
      success: ()=> {
      }
    })
    this.setState({createModalVisible: true})
  }

  openUpdateModal(value) {
    this.props.requestStations({
      success: ()=> {
      }
    })
    this.setState({selectedInvestor:value,updateModalVisible: true})
  }

  createInvestor(data) {
    this.props.updateLoadingState({isLoading: true})
    let payload = {
      ...data,
      success: ()=> {

        this.setState({createModalVisible: false, modalKey: this.state.modalKey - 1}, ()=> {
          this.refresh()
        })
      },
      error: (err)=> {
        message.error(err.message)
        this.props.updateLoadingState({isLoading: false})
      }
    }
    this.props.createInvestor(payload)
  }

  updateInvestor(data) {
    let payload = {
      ...data,
      investorId: this.state.selectedRowId[0],
      success: ()=> {
        this.setState({updateModalVisible: false, modalKey: this.state.modalKey - 1}, ()=> {
          this.refresh()
        })
      },
      error: (err)=> {
        console.log('err===>', err.message)
      }
    }
    this.props.updateInvestor(payload)
  }

  render() {
    // console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        <StationMenu
          showVisible = {this.props.showVisible}
          editVisible = {this.props.editVisible}
          addVisible = {this.props.addVisible}
          showDetail={()=> {
            console.log('hahahahahhaha')
          }}
          add={()=> {
            this.openCreateModal()
          }}
          set={()=> {
            this.openUpdateModal()
          }}
          setStatus={()=> {
            this.setStatus()
          }}
          refresh={()=> {
            this.refresh()
          }}
        />
        {this.renderSearchBar()}
        <InvestorList
          selectStation={(rowId, rowData)=> {
          this.selectInvestor(rowId, rowData)
        }}
          investors={this.props.investors}
          editInvestor={(value)=>{this.openUpdateModal(value)}}
          setInvestorStatus={(value)=>{this.setStatus(value)}}
        />
        <CreateInvestorModal
          modalKey={this.state.modalKey}
          onOk={(data)=> {
            this.createInvestor(data)
          }}
          onCancel={()=> {
            console.log('i, m cancel')
            this.setState({createModalVisible: false})
          }}
          userList={this.props.investorList}
          stationList={this.props.stations}
          modalVisible={this.state.createModalVisible}
        />
        {this.state.updateModalVisible ? <UpdateInvestorModal
          modalKey={this.state.modalKey}
          onOk={(data)=> {
            this.updateInvestor(data)
          }}
          onCancel={()=> {
            console.log('i, m cancel')
            this.setState({updateModalVisible: false, modalKey: this.state.modalKey - 1})
          }}
          investor={this.state.selectedInvestor}
          userList={this.props.investorList}
          stationList={this.props.stations}
          modalVisible={this.state.updateModalVisible}
        /> : null}
        <LoadActivity tip="正在提交..."/>

      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let investors = stationSelector.selectInvestors(state)
  let investorList = selector.selectUsersByRole(state, ROLE_CODE.STATION_INVESTOR)
  let showVisible = selector.selectValidPermissions(state,[PERMISSION_CODE.STATION_INVESTOR_QUERY_WHOLE,PERMISSION_CODE.STATION_QUERY_PART])
  let addVisible = selector.selectValidPermissions(state,[PERMISSION_CODE.STATION_ADD_WHOLE,PERMISSION_CODE.STATION_ADD_PART])
  let editVisible = selector.selectValidPermissions(state,[PERMISSION_CODE.STATION_EDIT_WHOLE,PERMISSION_CODE.STATION_EDIT_PART])
  console.log('investors=====>',investors)
  return {
    investors: investors,
    stations: stations,
    investorList: investorList,
    editVisible: editVisible,
    addVisible: addVisible,
    showVisible: showVisible
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...action,
  ...loadAction

};

export default connect(mapStateToProps, mapDispatchToProps)(InvestorManage);

export {saga, reducer} from './redux';
