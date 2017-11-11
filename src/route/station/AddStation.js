/**
 * Created by lilu on 2017/9/23.
 */

import React from 'react';
import {withRouter} from 'react-router'
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button, Form, InputNumber, message} from 'antd';
import {stationAction, stationSelector} from './redux';
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
    span: 3
  },
  wrapperCol: {
    span: 21
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
    this.props.fetchAdminsByRole({
      roleCode: ROLE_CODE.STATION_MANAGER,
      onFailure: (e)=>{console.log(e.message)}
    })
  }

  userList() {
    if (this.props.userList && this.props.userList.length > 0) {
      // console.log('this.props.userList',this.props.userList)
      let userList = this.props.userList.map((item, key)=> {
        return <Option key={key} value={item.id}>{item.nickname+ ' '+item.mobilePhoneNumber}</Option>
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
          this.props.history.push({pathname: '/site_list/showStation/' + stationId})
        },
        error: (err)=> {
          console.log(err.message)
          message.error('提交失败')
          this.props.updateLoadingState({isLoading: false})
        }
      }
      console.log('data====>',data.platformProp)
      // console.log('typeOf====>',typeof(data.powerUnitPrice))

      this.props.createStation(payload)
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
    let station = this.props.station
    const { getFieldDecorator, getFieldsValue, getFieldsError } = this.props.form

    // console.log('[DEBUG] ---> SysUser props: ', this.state.partnerList);
    // let plate = {id:'platform',shareholderName:'平台', royalty: this.props.station?this.props.station.platformProp:0}
    // let partnerList = this.state.partnerList.splice(0,0,plate)
    return (
      <div>
        <Form  hideRequiredMark={ true}>
          <Row gutter={24}>
            <Col span={14}>
              <FormItem label='服务点名称'  {...formItemLayout2}>
                {this.props.form.getFieldDecorator('name', {

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
                  rules: [
                    {
                      required: false,
                      message: '管理员未选择'
                    }
                  ]
                })(
                  <Select allowClear={true}  >
                    {this.userList()}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={14}>
              <Row>
                <Col span={12}>
                  <FormItem label='服务点地址'  {...formItemLayout}>
                    {this.props.form.getFieldDecorator('division', {
                      rules: [
                        {
                          required: false,
                          message: '省市区未选择'
                        }
                      ]
                    })(
                      <DivisionCascader onChange={(value, label)=> {
                        this.selectDivision(value, label)
                      }} cascaderSize="large" />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem  >
                    {this.props.form.getFieldDecorator('addr', {
                      rules: [
                        {
                          required: false,
                          message: '服务点地址未填写'
                        }
                      ]
                    })(
                      <Input placeholder="服务点地址"/>
                    )}
                  </FormItem>
                </Col>
              </Row>

            </Col>
            <Col span={10}>
              <FormItem label='平台分成比例'  {...formItemLayout}>
                {this.props.form.getFieldDecorator('platformProp', {
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
              <FormItem label='使用单价'  {...formItemLayout}>
                {this.props.form.getFieldDecorator('unitPrice', {
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
  let userList = selector.selectAdminsByRole(state, ROLE_CODE.STATION_MANAGER)
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddStation)));

export {saga, reducer} from './redux';
