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
import {Row, Col, Input, Select, Button} from 'antd';
import ContentHead from '../../component/ContentHead'
import {stationAction, stationSelector} from './redux';
import {configSelector} from '../../util/config'
import PartnerList from './PartnerList'
import CreatePartnerModal from '../../component/station/CreatePartnerModal'

const Option = Select.Option;

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
      console.log('selectRow========>', this.state.selectedRowId)
    })
  }

  componentWillMount() {
    // console.log('hahahahah',this.props.match)
    this.props.requestPartners({stationId:this.props.match.params.id,success:()=>{
    }})
  }

  refresh() {
    this.props.requestPartners({stationId:this.props.match.params.id,success:()=>{
    }})
  }

  setStatus() {
    if (this.state.selectedRowId) {
      let data = undefined
      this.props.investors.forEach((item, key)=> {
        if (item.id == this.state.selectedRowId[0]) {
          data = item
        }
      })
      console.log('data====>',data)
      let payload = {
        investorId: data.id,
        success: ()=> {
          this.refresh()
        },
        error: (err)=> {
          console.log('i m false',err.message)
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

  provinceList() {
    if (this.props.areaList && this.props.areaList.length > 0) {
      let provinceList = this.props.areaList.map((item, key)=> {
        return <Option key={key} value={key}>{item.area_name}</Option>
      })
      return provinceList
    } else {
      return null
    }
  }

  cityList() {
    if (this.state.province && this.state.province.sub.length > 0) {
      let cityList = this.state.province.sub.map((item, key)=> {
        return <Option key={key} value={key}>{item.area_name}</Option>
      })
      return cityList
    } else {
      return null
    }
  }

  areaList() {
    if (this.state.city && this.state.city.sub.length > 0) {
      let areaList = this.state.city.sub.map((item, key)=> {
        return <Option key={key} value={key}>{item.area_name}</Option>
      })
      return areaList
    } else {
      return null
    }
  }

  provinceChange(value) {
    console.log('value========>', value)
    this.setState({province: this.props.areaList[value]}, ()=> {
      console.log('this.state.province', this.state.province)
    })
  }

  cityChange(value) {
    console.log('value========>', value)
    this.setState({city: this.state.province.sub[value]}, ()=> {
      console.log('this.state.city', this.state.city)
    })
  }

  areaChange(value) {
    console.log('value========>', value)
    this.setState({area: this.state.city.sub[value]}, ()=> {
      console.log('this.state.city', this.state.area)
    })
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

  openCreateModal(){
    // this.props.requestStations({success:()=>{console.log('asasas')}})
    this.setState({createModalVisible: true})
  }

  openUpdateModal(){
    // this.props.requestStations({success:()=>{console.log('asasas')}})
    this.setState({updateModalVisible: true})
  }

  createPartner(data){
    let payload = {
      ...data,
      stationId: this.props.match.params.id,
      success:()=>{
        this.setState({createModalVisible:false,modalKey: this.state.modalKey-1},()=>{this.refresh()})
      },
      error: (err)=>{console.log('err===>',err.message)}
    }
    console.log('payload----------111',payload)
    this.props.createPartner(payload)
  }

  updateInvestor(data){
    let payload = {
      ...data,
      investorId: this.state.selectedRowId[0],
      success:()=>{
        this.setState({updateModalVisible:false,modalKey: this.state.modalKey-1},()=>{this.refresh()})
      },
      error: (err)=>{console.log('err===>',err.message)}
    }
    console.log('payload----------111',payload)
    // this.setState({updateModalVisible:false,modalKey: this.state.modalKey-1},()=>{this.refresh()})

    this.props.updateInvestor(payload)
  }

  render() {
    // console.log('[DEBUG] ---> SysUser props: ', this.state.partnerList);
    // let plate = {id:'platform',shareholderName:'平台', royalty: this.props.station?this.props.station.platformProp:0}
    // let partnerList = this.state.partnerList.splice(0,0,plate)
    return (
      <div>
        <ContentHead headTitle='编辑服务点'/>
        <Row>
          <Col span = {6}>
            <p>服务点管理</p>
            </Col>
          <Col span = {6}>
            <p>{this.props.station.name}</p>
          </Col>
          <Col span = {6}>
            <p>管理员</p>
          </Col>
          <Col span = {6}>
            <p>{this.props.station.adminName+''+this.props.station.adminPhone}</p>
          </Col>
          </Row>
        <Row>
          <Col span = {4}>
            <p>服务点地址</p>
          </Col>
          <Col span = {20}>
            <p>{(this.props.station.province?this.props.station.province.label:'')+' '+(this.props.station.city?this.props.station.city.label:'')+'  '+(this.props.station.area?this.props.station.area.label:'')+ '  ' + this.props.station.addr}</p>
          </Col>
        </Row>
        <Row>
          <Col span = {4}>
            <p>干衣柜单价</p>
          </Col>
          <Col span = {4}>
            <p>{this.props.station.unitPrice+'元每分钟'}</p>
          </Col>
          <Col span = {4}>
            <p>干衣柜押金</p>
          </Col>
          <Col span = {4}>
            <p>{this.props.station.deposit+'元'}</p>
          </Col>
          <Col span = {4}>
            <p>电费单价</p>
          </Col>
          <Col span = {4}>
            <p>{this.props.station.powerUnitPrice+''+'元／度'}</p>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <h5>服务点分成</h5>
            </Col>
          <Col span={4}>
          <Button onClick={()=>{this.openCreateModal()}}>添加分成方</Button>
        </Col>
          <Col span={4}>
            <p >{'平台分成:'+this.props.station.platformProp*100 +'%'}</p>
          </Col>
        </Row>
        <PartnerList  type='show' partners={this.props.partners}/>
        <CreatePartnerModal
          modalKey = {this.state.modalKey}
          onOk = {(data)=>{this.createPartner(data)}}
          onCancel = {()=>{console.log('i, m cancel')
            this.setState({createModalVisible: false})
          }}
          userList = {this.props.userList}
          stationList = {this.props.stations}
          modalVisible = {this.state.createModalVisible}
        />
      </div>
    )

  };
}

const mapStateToProps = (state, ownProps) => {
  // console.log('ownporsoss.......aaa',ownProps)
  let userList=[{id:'59c27b4b128fe10035923744', nickname:'绿蚁002'},{nickname:'绿蚁001', id: '59acdd051b69e600643de670'}]

  let areaList = configSelector.selectAreaList(state)
  let station = stationSelector.selectStation(state,ownProps.match.params.id)
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

export default connect(mapStateToProps, mapDispatchToProps)(ShowStation);

export {saga, reducer} from './redux';
