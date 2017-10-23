/**
 * Created by wanpeng on 2017/10/23.
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
import RedEnvelopeCreateForm from './RedEnvelopeCreateForm'

class RedEnvelopePromotion extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchPromCategoryAction({})
  }

  render() {
    return (
      <div className={style.content}>
        <RedEnvelopeCreateForm history={this.props.history} />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RedEnvelopePromotion))
