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
} from 'antd'
import style from './promotion.module.scss'
import PromotionSearchForm from './PromotionSearchForm'

const ButtonGroup = Button.Group


class Promotion extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={style.content}>
        <div className={style.operation}>
          <ButtonGroup>
            <Button icon="plus-circle-o" onClick={this.showDetail}>新增活动</Button>
          </ButtonGroup>
        </div>
        <Row>
          <PromotionSearchForm />
        </Row>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Promotion))
