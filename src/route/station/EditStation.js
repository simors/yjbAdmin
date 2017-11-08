/**
 * Created by lilu on 2017/9/25.
 */

import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router'
import {Row, Col, Input, Select, Button, Form, InputNumber, message, Spin} from 'antd';
import {stationAction, stationSelector} from './redux';
import PartnerList from './PartnerList'
import CreatePartnerModal from '../../component/station/CreatePartnerModal'
import UpdatePartnerModal from '../../component/station/UpdatePartnerModal'
import DivisionCascader from '../../component/DivisionCascader'
import {action, selector} from '../../util/auth'
import LoadActivity, {loadAction} from '../../component/loadActivity'
import {ROLE_CODE, PERMISSION_CODE} from '../../util/rolePermission'
import mathjs from 'mathjs'

const Option = Select.Option;
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  }
}

const formItemLayout2 = {
  labelCol: {
    span: 3,

  },
  wrapperCol: {
    span: 21,

  }
}

class EditStation extends React.Component {
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
      selectedPartner: undefined,
      modalKey: -1,
      partnerList: [],
    }
  }

  componentWillMount() {
    this.props.requestPartners({
      stationId: this.props.match.params.id, success: ()=> {
      }
    })
    this.props.listUsersByRole({
      roleCode: ROLE_CODE.STATION_MANAGER,
      onFailure: (e)=>{console.log(e.message)},
      onSuccess: ()=>{this.props.listUsersByRole({
        roleCode: ROLE_CODE.STATION_PROVIDER,
        onFailure: (e)=>{console.log(e.message)}
      })}
    })
  }

  refresh() {
    this.props.updateLoadingState({isLoading: true})

    this.props.requestPartners({
      stationId: this.props.match.params.id, success: ()=> {
        this.props.updateLoadingState({isLoading: false})
      }
    })
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

  selectDivision(value, label) {
    if (label.length == 3) {
      this.setState({
        province: {label: label[0].label, value: label[0].value},
        city: {label: label[1].label, value: label[1].value},
        area: {label: label[2].label, value: label[2].value},
      })
    } else if (label.length == 2) {
      this.setState({
        province: {label: label[0].label, value: label[0].value},
        city: {label: label[1].label, value: label[1].value},
      })
    } else if (label.length == 1) {
      this.setState({
        province: {label: label[0].label, value: label[0].value},
      })
    }
  }

  search() {
    let payload = {
      province: this.state.province ? this.state.province.area_name : undefined,
      city: this.state.city ? this.state.city.area_name : undefined,
      area: this.state.area ? this.state.area.area_name : undefined,
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

  openCreateModal() {
    this.setState({createModalVisible: true})
  }

  openUpdateModal(data) {
    this.setState({selectedPartner: data})
    this.setState({updateModalVisible: true})
  }

  setPartnerStatus(data) {
    console.log('data', data)
    let payload = {
      partnerId: data.id,
      success: ()=> {
        this.refresh()
      },
      error: (err)=> {
        console.log('err==>', err.message)
      }
    }
    if (data.status == 1) {
      this.props.closePartner(payload)
    } else {
      this.props.openPartner(payload)

    }
  }

  adminList() {
    if (this.props.adminList && this.props.adminList.length > 0) {
      let adminList = this.props.adminList.map((item, key)=> {
        return <Option key={key} value={item.id}>{item.nickname+' '+item.mobilePhoneNumber}</Option>
      })
      return adminList
    } else {
      return null
    }
  }

  partnerList() {
    if (this.props.partnerList && this.props.partnerList.length > 0) {
      let partnerList = this.props.partnerList.map((item, key)=> {
        return <Option key={key} value={item.id}>{item.idName}</Option>
      })
      return partnerList
    } else {
      return null
    }
  }

  createPartner(data) {
    let payload = {
      ...data,
      stationId: this.props.match.params.id,
      success: ()=> {
        this.setState({spinShow: false, createModalVisible: false, modalKey: this.state.modalKey - 1}, ()=> {
          message.success('提交成功')
          this.refresh()
        })
      },
      error: (err)=> {
        this.setState({spinShow: false, createModalVisible: false, modalKey: this.state.modalKey - 1}, ()=> {
        message.error(err.message)
          this.props.updateLoadingState({isLoading: false})
          // this.refresh()
        })
      }
    }
    this.props.updateLoadingState({isLoading: true})

    this.props.createPartner(payload)
  }

  updatePartner(data) {
    this.props.updateLoadingState({isLoading: true})
    let payload = {
      ...data,
      stationId: this.props.match.params.id,
      partnerId: this.state.selectedPartner.id,
      success: ()=> {
        this.setState({ updateModalVisible: false, modalKey: this.state.modalKey - 1}, ()=> {
          // this.props.updateLoadingState({isLoading: false})
          message.success('提交成功')
          this.refresh()
        })
      },
      error: (err)=> {

        this.setState({updateModalVisible: false, modalKey: this.state.modalKey - 1}, ()=> {
          this.props.updateLoadingState({isLoading: false})
          message.error(err.message)
      })
      }
    }
    this.props.updatePartner(payload)
  }

  submitStation() {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      let data = this.props.form.getFieldsValue()
      data.platformProp = mathjs.chain(data.platformProp).multiply(1/100).done()

      let payload = {
        ...data,
        stationId: this.props.match.params.id,
        province: this.state.province,
        city: this.state.city,
        area: this.state.area,
        success: ()=> {
          this.setState({spinShow: false})
          message.success('提交成功')
          this.props.history.push({
            pathname: '/site_list'
          })
          this.props.updateLoadingState({isLoading: false})
        },
        error: (err)=> {
          message.error(err.message)
          this.props.updateLoadingState({isLoading: false})
          // console.log(err.message)
        }
      }
      this.props.updateLoadingState({isLoading: true})
      console.log('data======>', data)
      this.props.updateStation(payload)
    })
  }


  hasErrors(fieldsError, values, balance) {
    if (Object.keys(fieldsError).some(field => fieldsError[field])) {
      return true
    }
    let isValid = values['name'] && values['adminId'] &&  values['division'] && values['addr'] &&values['platformProp'] >= 0 && values['platformProp'] <= 100 && values['unitPrice'] >= 0 && values['powerUnitPrice'] >= 0 && values['deposit'] >= 0
    return !isValid
  }


  render() {
    const { getFieldDecorator, getFieldsValue, getFieldsError } = this.props.form

    let station = this.props.station
    let division = []
    if (station) {
      if (station.province) {
        division.push(station.province.value)
      }
      if (station.city) {
        division.push(station.city.value)
      }
      if (station.area) {
        division.push(station.area.value)
      }
    }
    return (
      <div>
        <Form  hideRequiredMark={ true}>
          <Row gutter={24}>
            <Col span={14}>
              <FormItem label='服务点名称'  {...formItemLayout2}>
                {this.props.form.getFieldDecorator('name', {

                  initialValue: station ? station.name : '',
                  rules: [
                    {
                      required: false,
                      message: '服务点名称未填写'
                    }
                  ]
                })(
                  <Input  />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem label='选择管理员'  {...formItemLayout}>
                {this.props.form.getFieldDecorator('adminId', {
                  initialValue: station ? station.adminId : '',
                  rules: [
                    {
                      required: false,
                      message: '管理员未选择'
                    }
                  ]
                })(
                  <Select allowClear={true}  >
                    {this.adminList()}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={14}>
              <Row>
                <Col span={12}>
                  <FormItem label='服务点地址' {...formItemLayout}>
                    {this.props.form.getFieldDecorator('division', {
                      initialValue: division,
                      rules: [
                        {
                          required: false,
                          message: '省市区未选择'
                        }
                      ]
                    })(
                      <DivisionCascader onChange={(value, label)=> {
                        this.selectDivision(value, label)
                      }}  cascaderSize="large" />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {this.props.form.getFieldDecorator('addr', {
                      initialValue: station ? station.addr : '',
                      rules: [
                        {
                          required: false,
                          message: '服务点地址未填写'
                        }
                      ]
                    })(
                      <Input  placeholder="服务点地址"/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span={10}>
              <FormItem label='平台分成比例'  {...formItemLayout}>
                {this.props.form.getFieldDecorator('platformProp', {
                  initialValue: station ? station.platformProp*100 : 0,
                  rules: [
                    {
                      required: false,
                      message: '平台分成比例未填写'
                    }
                  ]
                })(<InputNumber
                                max={100}
                                min={0}
                />)}
                <span className="ant-form-text">%</span>
              </FormItem>

            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={7}>
              <FormItem label='干衣柜单价'  {...formItemLayout}>
                {this.props.form.getFieldDecorator('unitPrice', {
                  initialValue: station ? station.unitPrice : 0,
                  rules: [
                    {
                      required: false,
                      message: '干衣柜单价未填写'
                    }
                  ]
                })(<InputNumber  min={0}
                />)}
                <span className="ant-form-text">元/分钟</span>
              </FormItem>
            </Col>

            <Col span={7}>
              <FormItem label='电费单价'  {...formItemLayout}>
                {this.props.form.getFieldDecorator('powerUnitPrice', {
                  initialValue: station ? station.powerUnitPrice : 0,
                  rules: [
                    {
                      required: false,
                      message: '电费单价未填写'
                    }
                  ]
                })(<InputNumber  min={0}
                />)}
                <span className="ant-form-text">元/度</span>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem label='干衣柜押金'  {...formItemLayout}>
                {this.props.form.getFieldDecorator('deposit', {
                  initialValue: station ? station.deposit : 0,
                  rules: [
                    {
                      required: false,
                      message: '干衣柜押金未填写'
                    }
                  ]
                })(<InputNumber min={0}
                />)}
                <span className="ant-form-text">元</span>

              </FormItem>
            </Col>
          </Row>
          <LoadActivity tip="正在提交..."/>
        </Form>
        <Row gutter={24} style={{flexDirection:'row',marginTop:20,marginBottom:20,justifyContent:' center'}}>
          <Col span={8}></Col>
          <Col span={4}>
            <Button onClick={()=> {
              this.props.history.push({
                pathname: '/site_list'
              })
            }} type="primary">返回</Button>
          </Col>
          <Col span={4}>
            <Button disabled={this.hasErrors(getFieldsError(), getFieldsValue())} onClick={()=> {
              this.submitStation()
            }} type="primary">提交</Button>
          </Col>
        </Row>
      </div>
    )

  };
}

const mapStateToProps = (state, ownProps) => {
  let station = stationSelector.selectStation(state, ownProps.match.params.id)
  let partners = stationSelector.selectPartners(state)
  let adminList = selector.selectUsersByRole(state, ROLE_CODE.STATION_MANAGER)
  let partnerList = selector.selectUsersByRole(state, ROLE_CODE.STATION_PROVIDER)

  return {
    station: station,
    partners: partners,
    adminList: adminList,
    partnerList: partnerList
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...action,
  ...loadAction,

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditStation)));

export {saga, reducer} from './redux';
