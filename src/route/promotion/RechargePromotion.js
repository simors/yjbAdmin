/**
 * Created by wanpeng on 2017/10/10.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {
  Button,
  Table,
  Row,
  Form,
  Input,
  DatePicker,
} from 'antd'
import style from './promotion.module.scss'
import {actions} from './redux'
import RechargePromotionCreateForm from './RechargePromotionCreateForm'


class RechargePromotion extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchPromCategoryAction({})
  }

  render() {
    return (
      <div className={style.content}>
        <RechargePromotionCreateForm />
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...actions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RechargePromotion))
