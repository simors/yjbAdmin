/**
 * Created by lilu on 2017/11/11.
 */
/**
 * Created by wanpeng on 2017/9/25.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {
  Button,
  Table,
  Row,
  Col,
  Input,
  Form,
  Select,
  Radio,
} from 'antd'
import {selector as authSelector, action as authAction} from '../util/auth'

const Option = Select.Option


class AdminSelectByRole extends React.Component {
  constructor(props) {
    super(props)
    const {value, stationInfo} = props
    this.state = {
      division: stationInfo?[stationInfo&&stationInfo.province?stationInfo.province.value:'', stationInfo&&stationInfo.city?stationInfo.city.value:'', stationInfo&&stationInfo.area?stationInfo.area.value:'']:[],
      stationId: value,
    }
  }

  componentWillMount() {
    this.props.fetchAdminsByRole({
      roleCode: this.props.roleCode,
    });
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState({userId: value})
    }
  }

  userList() {
    if (this.props.userList && this.props.userList.length > 0) {
      let userList = this.props.userList.map((item, key)=> {
        return <Option key={key} value={item.id}>{item.nickname+'  '+ item.mobilePhoneNumber}</Option>
      })
      return userList
    } else {
      return null
    }
  }

  onSelectChange = (value) => {
    // if (!('value' in this.props)) {
    //   this.setState({ stationId })
    // }
    this.setState({userId: value})
    this.triggerChange(value)
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange

    if (onChange) {
      onChange(changedValue)
    }
  }

  userChange(value){
    console.log('value=====>',value)
    this.props.fetchAdminsByRole({
      roleCode: this.props.roleCode,
      nicknameOrMobilePhoneNumber: value,
    });
  }

  render() {
    return (
      <div style={{display: 'flex',flexDirection:'row',alignItems:'center'}}>
        <Select
                size = 'large'
                value = {this.state.userId}
                onChange={this.onSelectChange}
                showSearch = {true}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch = {(value)=>{this.userChange(value)}}
                allowClear={true} style={{width: 200}}>
          {this.userList()}
        </Select>
      </div>
    )
  }
}

AdminSelectByRole.defaultProps = {
  roleCode: undefined,
}

const mapStateToProps = (appState, ownProps) => {
  let userList = authSelector.selectAdminsByRole(appState, ownProps.roleCode)
  return {
   userList: userList,
  }
}

const mapDispatchToProps = {
  ...authAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminSelectByRole)
