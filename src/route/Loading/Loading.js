import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Redirect} from 'react-router-dom';
import {Spin} from 'antd';
import style from './Loading.module.scss';
import {appStateSelector} from '../../util/appstate'

class Loading extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    if (this.props.isRehydrated) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div className={style.container}>
        <Spin size="large" tip="加载中.."/>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let appState = appStateSelector.selectAppState(state)
  let isRehydrated = undefined
  if (appState) {
    isRehydrated = appState.isRehydrated
  }
  return {
    isRehydrated,
  }
};

export default withRouter(connect(mapStateToProps)(Loading));
