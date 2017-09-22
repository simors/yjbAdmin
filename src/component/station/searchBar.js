/**
 * Created by lilu on 2017/9/19.
 */

import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Button } from 'antd'

export default class searchBar extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    return (
      <div style={{paddingTop: 10, paddingBottom: 10, marginLeft: 10, borderBottomColor: 'black', borderBottomWidth: 2}}>
        <h3 style={{color: 'blue'}}>{this.props.headTitle?this.props.headTitle:'我来组成头部'}</h3>
      </div>
    )
  }
}
