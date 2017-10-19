/**
 * Created by lilu on 2017/9/21.
 */
/**
 * Created by lilu on 2017/9/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button} from 'antd';
import ContentHead from '../../component/ContentHead'
import InvestorList from './InvestorList';
import StationMenu from './StationMenu'
import {stationAction, stationSelector} from './redux';
import {configSelector} from '../../util/config'
import CreateInvestorModal from '../../component/station/CreateInvestorModal'
import UpdateInvestorModal from '../../component/station/UpdateInvestorModal'
import {selector, action} from '../../util/auth'

const Option = Select.Option;

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
      modalKey: -1
    }
  }

  selectInvestor(rowId, rowData) {
    this.setState({selectedRowId: rowId, selectedRowData: rowData}, ()=> {
      console.log('selectRow========>', this.state.selectedRowId)
    })
  }

  componentWillMount() {
    this.props.requestInvestors({
      success: ()=> {
        console.log('hahhahah')
      }
    });
    this.props.listUsersByRole({
      roleCode: 300,
    });
  }

  refresh() {
    this.props.requestInvestors({...this.state})
  }

  setStatus() {
    if (this.state.selectedRowId) {
      let data = undefined
      this.props.investors.forEach((item, key)=> {
        if (item.id == this.state.selectedRowId[0]) {
          data = item
        }
      })
      console.log('data====>', data)
      let payload = {
        investorId: data.id,
        success: ()=> {
          this.refresh()
        },
        error: (err)=> {
          console.log('i m false', err.message)
        }
      }
      if (data.status == 1) {
        this.props.closeInvestor(payload)
      } else {
        this.props.openInvestor(payload)
      }
    }
  }

  statusChange(value) {
    this.setState({status: parseInt(value)})
  }

  search() {
    let payload = {
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


  clearSearch() {
    this.setState({
      status: undefined,
      province: undefined,
      city: undefined,
      area: undefined,
      addr: undefined,
      name: undefined
    })
    this.props.requestStations()

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
          <Col span={3}>
            <Select allowClear={true} style={{width: 80}} onChange={(value)=> {
              this.provinceChange(value)
            }}>
              <Option key='all'>无</Option>
              {this.provinceList()}
            </Select>
          </Col>
          <Col span={3}>
            <Select allowClear={true} defaultValue='' style={{width: 80}} onChange={(value)=> {
              this.cityChange(value)
            }}>
              <Option key='all'>无</Option>
              {this.cityList()}
            </Select>
          </Col>
          <Col span={3}>
            <Select allowClear={true} defaultValue='' style={{width: 80}} onChange={(value)=> {
              this.areaChange(value)
            }}>
              <Option key='all'>无</Option>
              {this.areaList()}
            </Select>
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

  openCreateModal() {
    this.props.requestStations({
      success: ()=> {
      }
    })
    this.setState({createModalVisible: true})
  }

  openUpdateModal() {
    this.props.requestStations({
      success: ()=> {
      }
    })
    this.setState({updateModalVisible: true})
  }

  createInvestor(data) {
    let payload = {
      ...data,
      success: ()=> {
        this.setState({createModalVisible: false, modalKey: this.state.modalKey - 1}, ()=> {
          this.refresh()
        })
      },
      error: (err)=> {
        console.log('err===>', err.message)
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
        <InvestorList selectStation={(rowId, rowData)=> {
          this.selectInvestor(rowId, rowData)
        }} investors={this.props.investors}/>
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
        <UpdateInvestorModal
          modalKey={this.state.modalKey}
          onOk={(data)=> {
            this.updateInvestor(data)
          }}
          onCancel={()=> {
            console.log('i, m cancel')
            this.setState({updateModalVisible: false, modalKey: this.state.modalKey - 1})
          }}
          investor={this.state.selectedRowData ? this.state.selectedRowData[0] : undefined}
          userList={this.props.investorList}
          stationList={this.props.stations}
          modalVisible={this.state.updateModalVisible}
        />
      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let investors = stationSelector.selectInvestors(state)
  let investorList = selector.selectUsersByRole(state,300)
   return {
    investors: investors,
    stations: stations,
     investorList: investorList
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...action

};

export default connect(mapStateToProps, mapDispatchToProps)(InvestorManage);

export {saga, reducer} from './redux';
