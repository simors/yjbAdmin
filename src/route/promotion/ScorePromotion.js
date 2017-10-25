/**
 * Created by wanpeng on 2017/10/25.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {actions} from './redux'
import ScorePromotionCreateForm from './ScorePromotionCreateForm'
import style from './promotion.module.scss'


class ScorePromotion extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchPromCategoryAction({})
  }

  render() {
    return (
      <div className={style.content}>
        <ScorePromotionCreateForm history={this.props.history} />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScorePromotion))
