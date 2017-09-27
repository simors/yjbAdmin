/**
 * Created by lilu on 2017/9/23.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button, Form, InputNumber} from 'antd';
import ContentHead from '../../component/ContentHead'
import {stationAction, stationSelector} from './redux';
import {configSelector} from '../../util/config'
import PartnerList from './PartnerList'
import CreatePartnerModal from '../../component/station/CreatePartnerModal'
import DivisionCascader from '../../component/DivisionCascader'

const Option = Select.Option;
const FormItem = Form.Item
const formItemLayout = {
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
    // console.log('hahahahah',this.props.match)
    this.props.requestPartners({
      stationId: this.props.match.params.id, success: ()=> {
      }
    })
  }

  userList() {
    if (this.props.userList && this.props.userList.length > 0) {
      let userList = this.props.userList.map((item, key)=> {
        return <Option key={key} value={item.id}>{item.nickname}</Option>
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
      // console.log('=======>',{...this.props.form.getFieldsValue()})
      let data = this.props.form.getFieldsValue()
      let payload = {
        ...data,
        province: this.state.province,
        city: this.state.city,
        area: this.state.area,
        success: (stationId)=> {
          this.props.history.push({pathname: '/site/editStation/' + stationId})
        },
        error: (err)=> {
          console.log(err.message)
        }
      }
      console.log('data======>', data)
      // let count = this.state.count - 1
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
        <ContentHead headTitle='编辑服务点'/>
        <Form layout="horizontal">
          <Row>
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
              <FormItem label='投资人' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('adminId', {
                  rules: [
                    {
                      required: true,
                      message: '管理员未选择'
                    }
                  ]
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
                  <DivisionCascader defaultValue={[]} onChange={(value, label)=> {
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
              <FormItem label='干衣柜单价：' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('unitPrice', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '干衣柜单价未填写'
                    }
                  ]
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='干衣柜押金：' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('deposit', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '干衣柜押金未填写'
                    }
                  ]
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='电费单价：' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('powerUnitPrice', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '电费单价未填写'
                    }
                  ]
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='平台分成比例：' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('platformProp', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '平台分成比例未填写'
                    }
                  ]
                })(<InputNumber />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col>
            <Button onClick={()=> {
              this.submitStation()
            }}>提交</Button>
          </Col>
        </Row>
      </div>
    )

  };
}

const mapStateToProps = (state, ownProps) => {
  // console.log('ownporsoss.......aaa',ownProps)
  let userList = [{id: '59c27b4b128fe10035923744', nickname: '绿蚁002'}, {
    nickname: '绿蚁001',
    id: '59acdd051b69e600643de670'
  }]

  let areaList = configSelector.selectAreaList(state)
  let station = stationSelector.selectStation(state, ownProps.match.params.id)
  console.log('stationnoredux====>', station)
  let partners = stationSelector.selectPartners(state)
  // let station={name:'123',adminName:'321'}
  // console.log('areaList========>', areaList)
  // console.log('partners========>', partners)

  return {
    station: station,
    areaList: areaList,
    partners: partners,
    userList: userList

  };
};

const mapDispatchToProps = {
  ...stationAction

};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(AddStation));

export {saga, reducer} from './redux';
