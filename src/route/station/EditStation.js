/**
 * Created by lilu on 2017/9/25.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Input, Select, Button, Form, InputNumber, message, Spin} from 'antd';
import ContentHead from '../../component/ContentHead'
import {stationAction, stationSelector} from './redux';
import {configSelector} from '../../util/config'
import PartnerList from './PartnerList'
import CreatePartnerModal from '../../component/station/CreatePartnerModal'
import UpdatePartnerModal from '../../component/station/UpdatePartnerModal'
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
      spinShow: false
    }
  }

  componentWillMount() {
    // console.log('hahahahah',this.props.match)
    this.props.requestPartners({
      stationId: this.props.match.params.id, success: ()=> {
      }
    })
    this.props.testFetchUsers({
      success: ()=> {
      }
    })
  }

  refresh() {
    this.props.requestPartners({
      stationId: this.props.match.params.id, success: ()=> {
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
    // this.props.requestStations({success:()=>{console.log('asasas')}})
    this.setState({createModalVisible: true})
  }

  openUpdateModal(data) {
    this.setState({selectedPartner: data})
    // this.props.requestStations({success:()=>{console.log('asasas')}})
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
        message.error('提交失败')
        console.log('err===>', err.message)
      }
    }
    this.setState({spinShow: true})

    this.props.createPartner(payload)
  }

  updatePartner(data) {
    this.setState({spinShow: true})
    let payload = {
      ...data,
      stationId: this.props.match.params.id,
      partnerId: this.state.selectedPartner.id,
      success: ()=> {
        this.setState({spinShow: false,updateModalVisible: false, modalKey: this.state.modalKey - 1}, ()=> {
          message.success('提交成功')
          this.refresh()
        })
      },
      error: (err)=> {
        message.error('提交失败')
        console.log('err===>', err.message)
      }
    }
    console.log('payload----------111', payload)
    // this.setState({updateModalVisible:false,modalKey: this.state.modalKey-1},()=>{this.refresh()})

    this.props.updatePartner(payload)
  }

  submitStation() {
    this.props.form.validateFields((errors) => {
      this.setState({spinShow: true})
      if (errors) {
        return
      }
      // console.log('=======>',{...this.props.form.getFieldsValue()})
      let data = this.props.form.getFieldsValue()
      let payload = {
        ...data,
        stationId: this.props.match.params.id,
        province: this.state.province,
        city: this.state.city,
        area: this.state.area,
        success: (stationId)=> {
          this.setState({spinShow: false})
          message.success('提交成功')
          this.props.history.push({pathname: '/site/editStation/' + stationId})
        },
        error: (err)=> {
          message.error('提交失败')
          console.log(err.message)
        }
      }
      console.log('data======>', data)
      // let count = this.state.count - 1
      this.props.updateStation(payload)
    })
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
    console.log('division===>', division)
    // console.log('[DEBUG] ---> SysUser props: ', this.state.partnerList);
    // let plate = {id:'platform',shareholderName:'平台', royalty: this.props.station?this.props.station.platformProp:0}
    // let partnerList = this.state.partnerList.splice(0,0,plate)
    return (
      <div>
        <Spin size='large' spinning={this.state.spinShow}>
        <Form layout="horizontal">
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
                  <Input/>
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
                  initialValue: division,

                  rules: [
                    {
                      required: true,
                      message: '省市区未选择'
                    }
                  ]
                })(
                  <DivisionCascader defaultValue={division} onChange={(value, label)=> {
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
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label='干衣柜单价：' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('unitPrice', {
                  initialValue: station ? station.unitPrice : 0,
                  rules: [
                    {
                      required: true,
                      message: '干衣柜单价未填写'
                    }
                  ]
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='干衣柜押金：' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('deposit', {
                  initialValue: station ? station.deposit : 0,
                  rules: [
                    {
                      required: true,
                      message: '干衣柜押金未填写'
                    }
                  ]
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='电费单价：' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('powerUnitPrice', {
                  initialValue: station ? station.powerUnitPrice : 0,
                  rules: [
                    {
                      required: true,
                      message: '电费单价未填写'
                    }
                  ]
                })(<InputNumber />)}
              </FormItem>
            </Col>
            </Row>
            <Row>
            <Col span={6}>
              <FormItem label='平台分成比例：' hasFeedback {...formItemLayout}>
                {this.props.form.getFieldDecorator('platformProp', {
                  initialValue: station ? station.platformProp : 0,
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
        <Row>
          <Col span={4}>
            <h5>服务点分成</h5>
          </Col>
          <Col span={4}>
            <Button onClick={()=> {
              this.openCreateModal()
            }}>添加分成方</Button>
          </Col>
        </Row>
        <PartnerList editPartner={(data)=> {
          this.openUpdateModal(data)
        }}
                     type='edit' partners={this.props.partners}
                     setPartnerStatus={(data)=> {
                       this.setPartnerStatus(data)
                     }}
        />
        <CreatePartnerModal
          modalKey={this.state.modalKey}
          onOk={(data)=> {
            this.createPartner(data)
          }}
          onCancel={()=> {
            console.log('i, m cancel')
            this.setState({createModalVisible: false})
          }}
          userList={this.props.userList}
          stationList={this.props.stations}
          modalVisible={this.state.createModalVisible}
        />
        <UpdatePartnerModal
          modalKey={this.state.modalKey}
          onOk={(data)=> {
            this.updatePartner(data)
          }}
          onCancel={()=> {
            console.log('i, m cancel')
            this.setState({updateModalVisible: false, modalKey: this.state.modalKey - 1})
          }}
          partner={this.state.selectedPartner}
          userList={this.props.userList}
          stationList={this.props.stations}
          modalVisible={this.state.updateModalVisible}
        />
          </Spin>
      </div>
    )

  };
}

const mapStateToProps = (state, ownProps) => {
  // console.log('ownporsoss.......aaa',ownProps)
  let userList = stationSelector.selectUsers(state)

  let areaList = configSelector.selectAreaList(state)
  let station = stationSelector.selectStation(state, ownProps.match.params.id)
  let partners = stationSelector.selectPartners(state)
  // let station={name:'123',adminName:'321'}
  // console.log('areaList========>', areaList)
  console.log('partners========>', partners)

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

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(EditStation));

export {saga, reducer} from './redux';
