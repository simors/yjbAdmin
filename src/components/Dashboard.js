/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Button } from 'antd'
import {configAction, configSelector} from '../utils/config'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  fetchDomain = () => {
    this.props.requestDomain({times: 2})
  }

  render() {
    return (
      <div>
        Dashboard
        <div style={{marginTop: 10}}>
          <Button type="primary" onClick={this.fetchDomain}>获取域名</Button>
        </div>
        <div style={{marginTop: 10}}>
          {this.props.domain}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let domain = configSelector.selectDomain(state)
  return {
    domain,
  }
}

const mapDispatchToProps = {
  ...configAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
