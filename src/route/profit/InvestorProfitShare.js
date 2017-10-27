/**
 * Created by yangyang on 2017/10/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import {profitAction, profitSelector} from './redux'
import {PROFIT_SHARE_TYPE, stationSelector} from '../station'

class InvestorProfitShare extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getProfitSharing({type: PROFIT_SHARE_TYPE.INVESTOR_SHARE_TYPE})
  }

  render() {
    return (
      <div>fdf</div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let profitIds = profitSelector.selectProfitShareIdList(state, PROFIT_SHARE_TYPE.INVESTOR_SHARE_TYPE)
  let profitShares = []
  profitIds.forEach((profitId) => {
    profitShares.push(stationSelector.selectInvestorById(state, profitId))
  })
  console.log('profitShares', profitShares)
  return {
    profitShares,
  }
}

const mapDispatchToProps = {
  ...profitAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(InvestorProfitShare)