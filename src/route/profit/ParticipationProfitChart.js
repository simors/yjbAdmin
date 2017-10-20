/**
 * Created by yangyang on 2017/10/19.
 */
import React from 'react'
import {connect} from 'react-redux'

class ParticipationProfitChart extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        Participant
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

export default connect(mapStateToProps, mapDispatchToProps)(ParticipationProfitChart)