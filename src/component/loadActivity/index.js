/**
 * Created by yangyang on 2017/10/17.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Spin} from 'antd';
import {loadSelector, loadAction, loadSaga, loadReducer} from './redux'
import styles from './load.module.scss'

class LoadActivity extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    let {isLoading, force, tip} = this.props
    return isLoading || force ? (
      <div className={styles.container}>
        <Spin size="large" tip={tip}/>
      </div>
    ) : null
  }
}

LoadActivity.defaultProps = {
  tip: '加载中..',
  force: false,
}

const mapStateToProps = (state, ownProps) => {
  let isLoading = loadSelector.selectLoadState(state)
  return {
    isLoading,
  }
};

export default connect(mapStateToProps)(LoadActivity)

export {loadAction, loadSaga, loadReducer}