import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Redirect} from 'react-router-dom';
import {Spin} from 'antd';
import {selector as authSelector} from '../../util/auth';
import style from './Loading.module.scss';

class Loading extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.loading) {
      if (this.props.activeUserId !== undefined) {
        return (
          <Redirect to={this.props.from}/>
        );
      } else {
        return (
          <Redirect to={{
            pathname: "/login",
            state: {from: this.props.from}
          }}/>
        );
      }
    }

    return (
      <div className={style.container}>
        <Spin size="large" tip="加载中.."/>
      </div>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
    loading: authSelector.selectLoading(appState),
    activeUserId: authSelector.selectActiveUserId(appState),
  }
};

export default withRouter(connect(mapStateToProps)(Loading));
