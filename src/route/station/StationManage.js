/**
 * Created by lilu on 2017/9/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Row, Col} from 'antd';
import ContentHead from '../../component/ContentHead'
import StationList from './StationList';
import StationMenu from './StationMenu'
import {stationAction, stationSelector} from './redux';

class StationManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curUserId: -1,
      selectedRowId: undefined,
      selectedRowData: undefined,
    }
  }

  selectStation(rowId,rowData){
    this.setState({selectedRowId: rowId, selectedRowData: rowData},()=>{console.log('selectRow========>',this.state.selectRowId)})
  }

  componentWillMount() {
    this.props.requestStations({success:()=>{console.log('hahhahah')}});
  }

  refresh(){
    this.props.requestStations({...this.state})
  }

  setStatus(){
    if(this.state.selectedRowId&&this.state.selectedRowData){
      let payload = {
        stationId: this.state.selectedRowId,
        success: ()=>{this.refresh()},
        error: ()=>{console.log('i m false')}
      }
      let data = this.state.selectedRowData[0]
      if(data.status==1){
        this.props.closeStation(payload)
      }else{
        this.props.openStation(payload)
      }
    }
  }

  render() {
    // console.log('[DEBUG] ---> SysUser props: ', this.props);
    return (
      <div>
        <ContentHead headTitle='服务点信息管理'/>
        <StationMenu
          showDetail={()=>{console.log('hahahahahhaha')}}
          setStatus={()=>{this.setStatus()}}
          refresh = {()=>{this.refresh()}}
        />
        <StationList selectStation={(rowId,rowData)=>{this.selectStation(rowId,rowData)}} stations={this.props.stations} />
            </div>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  let stations = stationSelector.selectStations(state)
  return {
    stations: stations,
  };
};

const mapDispatchToProps = {
  ...stationAction

};

export default connect(mapStateToProps, mapDispatchToProps)(StationManage);

export { saga, reducer } from './redux';
