/**
 * Created by yangyang on 2017/6/28.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from 'antd'
import {requestPosition} from '../../actions/configActions'
import {selectLocation} from '../../selector/configSelector'

class Home extends Component {
  constructor(props) {
    super(props)
  }

  btnOnPress() {
    this.props.requestPosition({})
  }

  render() {
    return (
      <div>
        主页面
        <div>
          <Button type="primary" onClick={() => {this.btnOnPress()}}>获取地理位置</Button>
        </div>
        <div>
          {this.props.location ? this.props.location.address : ""}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    location: selectLocation(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestPosition,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)