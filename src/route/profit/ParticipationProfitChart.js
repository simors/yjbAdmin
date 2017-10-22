/**
 * Created by yangyang on 2017/10/19.
 */
import React from 'react'
import {connect} from 'react-redux'
import {profitAction} from './redux'
import {ACCOUNT_TYPE} from '../account'

class ParticipationProfitChart extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.stat30DaysAccountProfit({accountType: ACCOUNT_TYPE.PARTNER_ACCOUNT})
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
  ...profitAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(ParticipationProfitChart)