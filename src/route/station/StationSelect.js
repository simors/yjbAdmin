/**
 * Created by wanpeng on 2017/9/25.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import DivisionCascader from '../../component/DivisionCascader'
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
import {stationSelector, stationAction} from './redux'

const Option = Select.Option


class StationSelect extends React.Component {
  constructor(props) {
    super(props)
    const {value, stationInfo} = props
    this.state = {
      division: stationInfo?[stationInfo&&stationInfo.province?stationInfo.province.value:'', stationInfo&&stationInfo.city?stationInfo.city.value:'', stationInfo&&stationInfo.area?stationInfo.area.value:'']:[],
      stationId: value,
    }
  }

  componentWillMount() {
    this.props.requestStations({})
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState({stationId: value})
    }
  }

  inDivision(station) {
    let provinceCode = station.province? station.province.value : undefined
    let cityCode = station.city? station.city.value : undefined
    let areaCode = station.area? station.area.value : undefined
    if (this.state.division == undefined) {
      return true
    }
    if (this.state.division[0] && provinceCode && this.state.division[0] != provinceCode) {
      return false
    }
    if (this.state.division[1] && cityCode && this.state.division[1] != cityCode) {
      return false
    }
    if (this.state.division[2] && areaCode && this.state.division[2] != areaCode) {
      return false
    }
    return true
  }

  onDivisionChange = (value, selectedOptions) => {
    this.setState({
      division: value,
      stationId: undefined,
    })
    this.triggerChange(undefined)
  }

  onSelectChange = (value) => {
    // if (!('value' in this.props)) {
    //   this.setState({ stationId })
    // }
    this.setState({stationId: value})
    this.triggerChange(value)
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange

    if (onChange) {
      onChange(changedValue)
    }
  }

  render() {
    return (
      <div style={{display: 'flex',flexDirection:'row',alignItems:'center'}}>
        <DivisionCascader disabled={this.props.disabled}
                          value={this.state.division}
                          onChange={this.onDivisionChange}
                          level = {3}
                          cascaderSize="large"
                          showType = 'search'

        />
        <Select size='large' placeholder='请选择服务点' style={{width: 120}} notFoundContent="无服务点" value={this.state.stationId} disabled={this.props.disabled} onChange={this.onSelectChange}>
          {
            this.props.stationList.map((station, index) => {
              if (this.inDivision(station)) {
                return <Option key={index} value={station.id}>{station.name}</Option>
              }
            })
          }
        </Select>
      </div>
    )
  }
}

StationSelect.defaultProps = {
  disabled: false,
}

const mapStateToProps = (appState, ownProps) => {
  let stationId = ownProps.value
  let stationInfo = stationSelector.selectStation(appState, stationId)
  let stationList = stationSelector.selectStations(appState)
  return {
    stationList: stationList,
    stationInfo: stationInfo,
  }
}

const mapDispatchToProps = {
  ...stationAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(StationSelect)
