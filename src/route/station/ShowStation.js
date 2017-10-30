/**
 * Created by lilu on 2017/9/23.
 */
/**
 * Created by lilu on 2017/9/21.
 */
/**
 * Created by lilu on 2017/9/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button, Form, InputNumber} from 'antd';
import {stationAction, stationSelector} from './redux';
import PartnerList from './PartnerList'
import DivisionCascader from '../../component/DivisionCascader'
import {action,selector} from '../../util/auth'
import {ROLE_CODE, PERMISSION_CODE} from '../../util/rolePermission'

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

class ShowStation extends React.Component {
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

  selectInvestor(rowId, rowData) {
    this.setState({selectedRowId: rowId, selectedRowData: rowData}, ()=> {
    })
  }

  componentWillMount() {
    // console.log('hahahahah',this.props.match)
    this.props.requestPartners({
      stationId: this.props.match.params.id, success: ()=> {
      }
    })
    this.props.listUsersByRole({
      roleCode: 200,
      onFailure: (e)=>{console.log(e.message)}
    })
  }

  refresh() {
    this.props.requestPartners({
      stationId: this.props.match.params.id, success: ()=> {
      }
    })
  }


  adminList() {
    if (this.props.adminList && this.props.adminList.length > 0) {
      let adminList = this.props.adminList.map((item, key)=> {
        return <Option key={key} value={item.id}>{item.nickname+'  '+item.mobilePhoneNumber}</Option>
      })
      return adminList
    } else {
      return null
    }
  }




  render() {
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
    let {showPartnerVisible} = this.props
    return (
      <div>
        <Form >
          <Row>
            <Col span={12}>
              <FormItem label='服务点名称' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('name', {
                  // getValueFromEvent:(e)=>{
                  //  let value=this.setTrimValue(e.target.value)
                  //  return value
                  //},
                  initialValue: station ? station.name : '',
                  rules: [
                    {
                      required: true,
                      message: '服务点名称未填写'
                    }
                  ]
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='管理员' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('adminId', {
                  initialValue: station ? station.adminId : '',
                  rules: [
                    {
                      required: true,
                      message: '管理员未选择'
                    }
                  ]
                })(
                  <Select  disabled={true} allowClear={true} style={{width: 140}}>
                    {this.adminList()}
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
                  initialValue: division,

                  rules: [
                    {
                      required: true,
                      message: '省市区未选择'
                    }
                  ]
                })(
                  <DivisionCascader disabled={true} onChange={(value, label)=> {
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
                  initialValue: station ? station.addr : '',
                  rules: [
                    {
                      required: true,
                      message: '服务点地址未填写'
                    }
                  ]
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label='干衣柜单价：' hasFeedback {...formItemLayout2}>
                {this.props.form.getFieldDecorator('unitPrice', {
                  initialValue: station ? station.unitPrice : 0,
                  rules: [
                    {
                      required: true,
                      message: '干衣柜单价未填写'
                    }
                  ]
                })(<InputNumber disabled={true}
                                formatter={value => `${value}元／小时`}
                                parser={value => value.replace('元／小时', '')}
                />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='干衣柜押金：' hasFeedback {...formItemLayout2}>
                {this.props.form.getFieldDecorator('deposit', {
                  initialValue: station ? station.deposit : 0,
                  rules: [
                    {
                      required: true,
                      message: '干衣柜押金未填写'
                    }
                  ]
                })(<InputNumber disabled={true}
                                formatter={value => `${value}元`}
                                parser={value => value.replace('元', '')}
                />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='电费单价：' hasFeedback {...formItemLayout2}>
                {this.props.form.getFieldDecorator('powerUnitPrice', {
                  initialValue: station ? station.powerUnitPrice : 0,
                  rules: [
                    {
                      required: true,
                      message: '电费单价未填写'
                    }
                  ]
                })(<InputNumber disabled={true}
                                formatter={value => `${value}元／度`}
                                parser={value => value.replace('元／度', '')}
                />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='平台分成比例：' hasFeedback {...formItemLayout2}>
                {this.props.form.getFieldDecorator('platformProp', {
                  initialValue: station ? station.platformProp : 0,
                  rules: [
                    {
                      required: true,
                      message: '平台分成比例未填写'
                    }
                  ]
                })(<InputNumber disabled={true}
                                formatter={value => `${value}%`}
                                parser={value => value.replace('%', '')}
                />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        {
          showPartnerVisible ? <PartnerList type='show' partners={this.props.partners}/> : null
        }
        <Row gutter={24} style={{flexDirection:'row',marginTop:20,marginBottom:20,justifyContent:' center'}}>
          <Col span={10}></Col>
          <Col span={4}>
            <Button onClick={()=> {
              this.props.history.push({
                pathname: '/site_list'
              })
            }} type="primary">返回</Button>
          </Col>
        </Row>
      </div>
    )

  };
}

const mapStateToProps = (state, ownProps) => {
  let station = stationSelector.selectStation(state, ownProps.match.params.id)
  let partners = stationSelector.selectPartners(state)
  let adminList = selector.selectUsersByRole(state,ROLE_CODE.STATION_MANAGER)
  let showPartnerVisible = selector.selectValidPermissions(state, [PERMISSION_CODE.STATION_QUERY_PARTNER])

  return {
    station: station,
    partners: partners,
    adminList: adminList,
    showPartnerVisible,
  };
};

const mapDispatchToProps = {
  ...stationAction,
  ...action

};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ShowStation));

export {saga, reducer} from './redux';
