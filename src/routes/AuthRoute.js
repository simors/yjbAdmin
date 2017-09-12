/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Redirect} from 'react-router-dom'
import {fakeAuth} from '../utils/AuthTool'

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    fakeAuth.isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthRoute));
