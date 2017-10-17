/**
 * Created by yangyang on 2017/10/17.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Spin, Alert} from 'antd';
import {loadSelector, loadAction, loadSaga, loadReducer} from './redux'

class LoadActivity extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    let {isLoading, tip} = this.props
    return isLoading ? (
      <div>
        <Spin size="large" tip={tip}/>
      </div>
    ) : null
  }
}

LoadActivity.defaultProps = {
  tip: '加载中..',
}

const mapStateToProps = (state, ownProps) => {
  let isLoading = loadSelector.selectLoadState(state)
  return {
    isLoading,
  }
};

export default connect(mapStateToProps)(LoadActivity)

export {loadAction, loadSaga, loadReducer}