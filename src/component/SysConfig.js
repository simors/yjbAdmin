/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Button } from 'antd'
import {configAction, configSelector} from '../util/config'
import {stationAction,stationSelector} from '../route/station/redux'

class SysConfig extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount(){
    this.props.requestAreaList()
    this.props.requestStations()
  }

  fetchLocation = () => {
    this.props.requestPosition()
    // this.props.requestAreaList()
  }

  render() {
    return (
      <div>
        SysConfig
        <div style={{marginTop: 10}}>
          <Button type="primary" onClick={this.fetchLocation}>获取地理位置</Button>
        </div>
        <div style={{marginTop: 10}}>
          {this.props.location ? this.props.location.address : ''}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let location = configSelector.selectLocation(state)
  let areaList = configSelector.selectAreaList(state)
  let stations = stationSelector.selectStations(state)
  console.log('stations======>',stations)
  return {
    location,
    areaList,
    stations
  }
}

const mapDispatchToProps = {
  ...configAction,
  ...stationAction
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SysConfig))
