/**
 * Created by lilu on 2017/9/19.
 */
import React from 'react';
import {Button} from 'antd';
import style from './StationMenu.module.scss';
import {Link} from 'react-router-dom'

export default class ContentHead extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={style.stationMenu}>
        <Button  onClick={()=>{this.props.showDetail()}} icon="info-circle-o">查看</Button>
        <Button  onClick={()=>{this.props.add()}} icon="plus-circle-o">新增</Button>
        <Button  onClick={()=>{this.props.set()}} icon="edit">编辑</Button>
        <Button  onClick={()=>{this.props.setStatus()}} icon="minus-circle-o">启用／停用</Button>
        <Button  onClick={()=>{this.props.refresh()}} icon="reload">刷新</Button>
      </div>
    )
  }
}


