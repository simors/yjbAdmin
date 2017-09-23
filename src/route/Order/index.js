/**
 * Created by wanpeng on 2017/9/21.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {
  Button,
  Table,
  Row,
  Col,
  Input,
  Form,
  Select,
} from 'antd'
import ContentHead from '../../component/ContentHead'
import style from './order.module.scss'

class Order extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={style.content}>
        <ContentHead headTitle='充值订单' />
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {

  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Order))
