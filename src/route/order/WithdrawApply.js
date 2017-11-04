/**
 * Created by yangyang on 2017/11/5.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {
  Button,
  Table,
  Row,
} from 'antd'
import moment from "moment"

class WithdrawApply extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div></div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WithdrawApply))
