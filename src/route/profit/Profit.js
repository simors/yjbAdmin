/**
 * Created by yangyang on 2017/10/18.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Row, Col } from 'antd'
import {withRouter} from 'react-router-dom'

class Profit extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={8}>col-8</Col>
          <Col span={8} offset={8}>账户余额</Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profit))