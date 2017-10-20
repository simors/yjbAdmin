/**
 * Created by yangyang on 2017/10/19.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Row, Col, Button } from 'antd'

class WalletBar extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  toggleModel = () => {
    let {onClick} = this.props
    onClick()
  }

  render() {

    return (
      <div>
        <Row align="bottom">
          <Col span={2}><span>账户余额</span></Col>
          <Col span={6}><span style={{color: 'red'}}>¥ 12312312.312</span></Col>
          <Col span={4}>
            <span><Button type="primary" onClick={this.toggleModel}>取现</Button></span>
          </Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(WalletBar)