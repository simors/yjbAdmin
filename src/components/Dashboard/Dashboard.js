/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
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

export default withRouter(Dashboard)