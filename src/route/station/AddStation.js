/**
 * Created by lilu on 2017/9/23.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button, Form, InputNumber, message} from 'antd';
import ContentHead from '../../component/ContentHead'
import {stationAction, stationSelector} from './redux';
import {configSelector} from '../../util/config'
import PartnerList from './PartnerList'
import CreatePartnerModal from '../../component/station/CreatePartnerModal'
import DivisionCascader from '../../component/DivisionCascader'
import {action , selector} from '../../util/auth'
import LoadActivity, {loadAction} from '../../component/loadActivity'
import {ROLE_CODE} from '../../util/rolePermission'
import mathjs from 'mathjs'

const Option = Select.Option;
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}
const formItemLayout2 = {
  labelCol: {
    span: 12
  },
  wrapperCol: {
    span: 12
  }
}


class AddStation extends React.Component {
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
      modalKey: -1,
      partnerList: []
    }
  }

  selectDivision(value, label) {
    console.log('vauelsas', value, label)
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

  componentWillMount() {
    this.props.listUsersByRole({
      roleCode: ROLE_CODE.STATION_MANAGER,
      onFailure: (e)=>{console.log(e.message)}
    })
  }

  userList() {
    if (this.props.userList && this.props.userList.length > 0) {
      // console.log('this.props.userList',this.props.userList)
      let userList = this.props.userList.map((item, key)=> {
        return <Option key={key} value={item.id}>{item.nickname+' '+item.mobilePhoneNumber}</Option>
      })
      return userList
    } else {
      return null
    }
  }

  submitStation() {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      this.props.updateLoadingState({isLoading: true})
      let data = this.props.form.getFieldsValue()
      data.platformProp = mathjs.chain(data.platformProp).multiply(1/100).done()
      let payload = {
        ...data,
        province: this.state.province,
        city: this.state.city,
        area: this.state.area,
        success: (stationId)=> {
          this.props.updateLoadingState({isLoading: false})
          this.props.history.push({pathname: '/site_list/editStation/' + stationId})
        },
        error: (err)=> {
          console.log(err.message)
          message.error('提交失败')
          this.props.updateLoadingState({isLoading: false})
        }
      }
      // console.log('data====>',data.platformProp)
      // console.log('typeOf====>',typeof(data.powerUnitPrice))

      this.props.createStation(payload)
    })
  }

  render() {
    let station = this.props.station
    // console.log('[DEBUG] ---> SysUser props: ', this.state.partnerList);
    // let plate = {id:'platform',shareholderName:'平台', royalty: this.props.station?this.props.station.platformProp:0}
    // let partnerList = this.state.partnerList.splice(0,0,plate)
    return (
      <div>
        <Form >
          <Row style={{justifyContent:'start'}}>
            <Col span={12}>
              <FormItem label='服务点名称' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('name', {
                  // getValueFromEvent:(e)=>{
                  //  let value=this.setTrimValue(e.target.value)
                  //  return value
                  //},
                  rules: [
                    {
                      required: true,
                      message: '服务点名称未填写'
                    }
                  ]
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='管理员' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('adminId', {

                })(
                  <Select allowClear={true} style={{width: 140}}>
                    {this.userList()}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label='省市区' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('division', {
                  // getValueFromEvent:(e)=>{
                  //  let value=this.setTrimValue(e.target.value)
                  //  return value
                  //},
                  initialValue: [],

                  rules: [
                    {
                      required: true,
                      message: '省市区未选择'
                    }
                  ]
                })(
                  <DivisionCascader onChange={(value, label)=> {
                    this.selectDivision(value, label)
                  }}/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='服务点地址' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('addr', {
                  // getValueFromEvent:(e)=>{
                  //  let value=this.setTrimValue(e.target.value)
                  //  return value
                  //},
                  rules: [
                    {
                      required: true,
                      message: '服务点地址未填写'
                    }
                  ]
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label='干衣柜单价：' hasFeedback {...formItemLayout2}>
                {this.props.form.getFieldDecorator('unitPrice', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '干衣柜单价未填写'
                    }
                  ]
                })(<InputNumber
                  formatter={value => `${value}元/小时`}
                  parser={value => value.replace('元／小时', '')}

                />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='干衣柜押金：' hasFeedback {...formItemLayout2}>
                {this.props.form.getFieldDecorator('deposit', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '干衣柜押金未填写'
                    }
                  ]
                })(<InputNumber
                  formatter={value => `${value}元`}
                  parser={value => value.replace('元', '')}
                />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='电费单价：' hasFeedback {...formItemLayout2}>
                {this.props.form.getFieldDecorator('powerUnitPrice', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '电费单价未填写'
                    }
                  ]
                })(<InputNumber
                  formatter={value => `${value}元／度`}
                  parser={value => value.replace('元／度', '')}
                />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='平台分成比例：' hasFeedback {...formItemLayout2}>
                {this.props.form.getFieldDecorator('platformProp', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '平台分成比例未填写'
                    }
                  ]
                })(<InputNumber
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                />)}
              </FormItem>
            </Col>
          </Row>
          <LoadActivity tip = '正在提交...'/>
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
            <Button onClick={()=> {
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
  let userList = selector.selectUsersByRole(state, ROLE_CODE.STATION_MANAGER)
  return {
    station: station,
    partners: partners,
    userList: userList

  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...action,
  ...loadAction,

};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddStation));

export {saga, reducer} from './redux';
