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
import  {loadAction} from '../../component/loadActivity'
import {ROLE_CODE,PERMISSION_CODE} from '../../util/rolePermission'
import {smsAction,smsSelector} from '../../component/smsModal'
import StationSelect from './StationSelect'
import * as errno from '../../errno'

const Option = Select.Option;
const ButtonGroup = Button.Group
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

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
    this.props.updateLoadingState({isLoading: true})
    this.props.requestInvestors({
      success: ()=> {
        this.props.updateLoadingState({isLoading: false})
      },
      error: ()=>{
        this.props.updateLoadingState({isLoading: false})
      }
    });
    this.props.requestStations({
      status: 1,
      success: ()=> {
        this.props.updateLoadingState({isLoading: false})
      },
      error: ()=>{
        this.props.updateLoadingState({isLoading: false})
      }
    });
    this.props.fetchAdminsByRole({
      roleCode: ROLE_CODE.STATION_INVESTOR,
    });
  }

  refresh() {
    this.props.updateLoadingState({isLoading: true})
    this.props.requestInvestors({...this.state,success: ()=>{    this.props.updateLoadingState({isLoading: false})
    },error:()=>{this.props.updateLoadingState({isLoading: false})}
    })
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
      console.log('data====>',data)
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

  userChange(value){
    console.log('value=====>',value)
    this.props.fetchAdminsByRole({
      roleCode: ROLE_CODE.STATION_INVESTOR,
      nicknameOrMobilePhoneNumber: value,
    });
  }

  renderSearchBar() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form style={{marginTop: 12, marginBottom: 12}} layout="inline" onSubmit={(e)=>{this.search(e)}}>
        <FormItem  >
          {getFieldDecorator("stationId", {
          })(
            <StationSelect placeholder='请选择服务点' disabled={false}/>
          )}
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


    let params = {
      ...data,
      type: 'investor',
      success: ()=>{    this.props.updateSmsModal(payload)
      },
      error: (err)=>{message.error('该服务点已存在该投资人')}
    }
    this.props.validProfitSharing(params)
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
      error: (error)=> {
        switch (error.code) {
          case errno.ERROR_STATION_INVESTORREPEAT:
            message.error("该服务点已有该投资人")
            break
          default:
            message.error(`创建投资人失败, 错误：${error.code}`)
        }
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
      error: (error)=> {
        switch (error.code) {
          case errno.ERROR_STATION_INVESTORREPEAT:
            message.error("该服务点已有该投资人")
            break
          default:
            message.error(`更新投资人失败, 错误：${error.code}`)
        }
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
        {this.state.createModalVisible? <CreateInvestorModal
          userChange = {(value)=>{this.userChange(value)}}
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
        />:null}

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

      </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  let investors = stationSelector.selectInvestors(state)
  let investorList = selector.selectAdminsByRole(state, ROLE_CODE.STATION_INVESTOR)
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
