/**
 * Created by lilu on 2017/9/21.
 */
/**
 * Created by lilu on 2017/9/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button, message, Form} from 'antd';
import InvestorList from './InvestorList';
import StationMenu from './StationMenu'
import {stationAction, stationSelector} from './redux';
import CreateInvestorModal from '../../component/station/CreateInvestorModal'
import UpdateInvestorModal from '../../component/station/UpdateInvestorModal'
import {selector, action} from '../../util/auth'
import LoadActivity, {loadAction} from '../../component/loadActivity'
import {ROLE_CODE,PERMISSION_CODE} from '../../util/rolePermission'
import {smsAction,smsSelector} from '../../component/smsModal'

const Option = Select.Option;
const ButtonGroup = Button.Group
const FormItem = Form.Item

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
      modalKey: -1,
      mobilePhoneNumber: undefined,
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
        status: 1
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
          message.error(err.message)
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

  search(e) {
    e.preventDefault()
    this.props.updateLoadingState({isLoading: true})
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      let data = this.props.form.getFieldsValue()
      let payload = {
        mobilePhoneNumber: data.mobilePhoneNumber,
        stationId: data.stationId,
        status: data.status && data.status.key ? parseInt(data.status.key): undefined,
        success: ()=> {
          this.props.updateLoadingState({isLoading: false})
        },
        error: (err)=> {
          this.props.updateLoadingState({isLoading: false})

          message.error(err.message)
        }
      }
      this.props.requestInvestors(payload)
      // console.log('data======>',data)
      // let count = this.state.count - 1
    })
  }


  selectStation(value){
    this.setState({
      stationId: value
    })
  }

  renderSearchBar() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form style={{marginTop: 12, marginBottom: 12}} layout="inline" onSubmit={(e)=>{this.search(e)}}>
        <FormItem>
          {getFieldDecorator("stationId", {
            initialValue: '',
          })(
            <Select style={{width: 120}} placeholder="选择服务网点" >
              <Option value="">全部</Option>
              {
                this.props.stations.map((station, index) => (
                  <Option key={index} value={station.id}>{station.name}</Option>
                ))
              }
            </Select>        )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("status", {

          })(
            <Select labelInValue={true} placeholder="状态" allowClear={true}
                    style={{width: 120}} >
              <Option value='1'>正常</Option>
              <Option value='0'>已停用</Option>
            </Select>      )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("mobilePhoneNumber", {
          })(
            <Input placeholder = '电话号码' />
          )}
        </FormItem>
        <FormItem>
          <Button.Group>
            <Button onClick={() => {this.props.form.resetFields()}}>重置</Button>
            <Button type="primary" htmlType="submit">查询</Button>
          </Button.Group>
        </FormItem>
      </Form>

    )
  }
  //
  // renderSearchBar() {
  //   const { getFieldDecorator } = this.props.form
  //
  //   return (
  //     <div className="ant-form"  style={{flex: 1,fontSize: 12,marginTop: 12, marginBottom: 12}}>
  //       <Row gutter={24} className="ant-form">
  //         <Col span={4}>
  //           <Select allowClear={true} style={{width: 120}} placeholder='状态' onChange={(value)=> {
  //             this.statusChange(value)
  //           }}>
  //             <Option value='1'>正常</Option>
  //             <Option value='0'>已停用</Option>
  //           </Select>
  //         </Col>
  //         <Col span={4}>
  //           <Select style={{width: 120}} placeholder="选择服务网点" onChange={(value)=>{this.selectStation(value)}}>
  //             <Option value="">全部</Option>
  //             {
  //               this.props.stations.map((station, index) => (
  //                 <Option key={index} value={station.id}>{station.name}</Option>
  //               ))
  //             }
  //           </Select>
  //           </Col>
  //         <Col span={4}>
  //          <Input placeholder = '电话号码' onChange={(e)=>{this.setState({mobilePhoneNumber: e.target.value})}} />
  //         </Col>
  //         <Col span={4}>
  //           <ButtonGroup>
  //           <Button type="primary" onClick={()=> {
  //             this.search()
  //           }}>查询</Button>
  //           <Button type="primary" onClick={()=> {
  //             this.clearSearch()
  //           }}>重置</Button>
  //                       </ButtonGroup>
  //         </Col>
  //       </Row>
  //
  //     </div>
  //   )
  // }

  openCreateModal() {
    this.props.requestStations({
      status: 1,
      success: ()=> {
      }
    })
    this.setState({createModalVisible: true})
  }

  openUpdateModal(value) {
    // console.log('value=======>',value)
    this.props.requestStations({
      status: 1,
      success: ()=> {
      }
    })
    this.setState({selectedInvestor:value,updateModalVisible: true})
  }

  createInvestorSmsModal(data) {
    let payload = {
      modalVisible: true,
      op: '增加投资人',
      verifySuccess: ()=>{this.createInvestor(data)},
      verifyError: ()=>{message.error('验证错误')}

    }
    this.props.updateSmsModal(payload)
  }

  updateInvestorSmsModal(data) {
    let payload = {
      modalVisible: true,
      op: '更新投资人',
      verifySuccess: ()=>{this.updateInvestor(data)},
      verifyError: (e)=>{message.error(e.message)}

    }
    this.props.updateSmsModal(payload)
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
    // console.log('data======>',data)
    let payload = {
      ...data,
      investorId: this.state.selectedInvestor.id,
      success: ()=> {
        this.setState({updateModalVisible: false, modalKey: this.state.modalKey - 1}, ()=> {
          this.refresh()
        })
      },
      error: (err)=> {
        message.error(err.message)
      }
    }
    this.props.updateInvestor(payload)
  }

  render() {
    return (
      <div>
        <StationMenu
          addVisible = {this.props.addVisible}
          showDetail={()=> {
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
            this.createInvestorSmsModal(data)
          }}
          onCancel={()=> {
            this.setState({createModalVisible: false})
          }}
          userList={this.props.investorList}
          stationList={this.props.stations}
          modalVisible={this.state.createModalVisible}
        />
        {this.state.updateModalVisible ? <UpdateInvestorModal
          modalKey={this.state.modalKey}
          onOk={(data)=> {
            this.updateInvestorSmsModal(data)
          }}
          onCancel={()=> {
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
  let addVisible = selector.selectValidPermissions(state,[PERMISSION_CODE.STATION_INVESTOR_ADD])
  return {
    investors: investors,
    stations: stations,
    investorList: investorList,
    addVisible: addVisible,
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...action,
  ...loadAction,
  ...smsAction

};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(InvestorManage));

export {saga, reducer} from './redux';
