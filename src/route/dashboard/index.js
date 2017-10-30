/**
 * Created by yangyang on 2017/10/30.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Row, Col} from 'antd';
import {selector as authSelector} from '../../util/auth'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  renderHeader() {
    let {currentAdminUser, roleNames} = this.props
    if (!currentAdminUser || !roleNames) {
      return null
    }
    return (
      <div>
        <Row>
          <Col span={10}>
            <div style={{fontSize: 22}}>
              {currentAdminUser.nickname}
            </div>
            <div style={{fontSize: 12}}>
              {
                roleNames.map((role, key) => {
                  return (
                    <span key={key} style={{marginRight: 8}}>
                      {role}
                    </span>
                  )
                })
              }
            </div>
          </Col>
          <Col span={14}></Col>
        </Row>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderHeader()}
        <hr/>
        <div>
          {Number('12353412323').toLocaleString()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentAdminUser = authSelector.selectCurAdminUser(state)
  let roleNames = authSelector.selectUserRoleName(state, currentAdminUser.roles)
  console.log('currentAdminUser', currentAdminUser)
  return {
    currentAdminUser,
    roleNames,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
