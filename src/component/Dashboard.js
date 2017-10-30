/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        Dashboard
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
