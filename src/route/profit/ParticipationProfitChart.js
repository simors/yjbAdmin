/**
 * Created by yangyang on 2017/10/19.
 */
import React from 'react'
import {connect} from 'react-redux'
import createG2 from 'g2-react'
import {Stat, Frame} from 'g2'
import {profitAction, profitSelector} from './redux'
import {ACCOUNT_TYPE, accountSelector} from '../account'
import {stationSelector} from '../station'

class ParticipationProfitChart extends React.PureComponent {
  constructor(props) {
    super(props)

    this.ProfitChart = createG2(chart => {
      chart.forceFit();
      chart.axis('date', {
        title: {
          fontSize: '16',
          textAlign: 'center',
        },
      });
      chart.col('date', {
        alias: '日期',
        type: 'time',
        mask: 'mm-dd',
        range: [0, 1],
      })
      chart.axis('profit', {
        title: {
          fontSize: '16',
          textAlign: 'center',
        },
      });
      chart.col('profit', {
        alias: '收益（元）',
      })
      chart.legend('stationName', {
        title: null, // 不展示图例 title
      });
      chart.line().position('date*profit').color('stationName').shape('stationName', () => 'smooth').size(3);
      chart.render();
    })
  }

  componentDidMount() {
    this.props.stat30DaysAccountProfit({accountType: ACCOUNT_TYPE.PARTNER_ACCOUNT})
  }

  render() {
    let {stationNameList, profitData} = this.props
    if (!stationNameList || !profitData) {
      return null
    }
    let frame = new Frame(profitData);
    frame = Frame.combineColumns(frame, stationNameList, 'profit', 'stationName', ['date'])
    return (
      <div>
        <this.ProfitChart forceFit={true} height={500} width={200} data={frame} plotCfg={{margin: [50, 150, 80, 100]}} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let partnerProfitList = profitSelector.selectPartnerProfitList(state)
  let stationNameSet = new Set()
  let partnerProfitMap = new Map()
  let profitData = []
  partnerProfitList.forEach((investProfit) => {
    let accountProfit = accountSelector.selectAccountProfitById(state, investProfit)
    let station = stationSelector.selectStationById(state, accountProfit.stationId)
    stationNameSet.add(station.name)
    let stationProfit = {stationName: station.name, profit: accountProfit.profit}
    let profitMapValue = partnerProfitMap.get(accountProfit.accountDay)
    if (!profitMapValue) {
      partnerProfitMap.set(accountProfit.accountDay, [stationProfit])
    } else {
      profitMapValue.push(stationProfit)
      partnerProfitMap.set(accountProfit.accountDay, profitMapValue)
    }
  })
  for (let dateKey of partnerProfitMap.keys()) {
    let profitObj = {}
    profitObj.date = dateKey
    for (let stationName of stationNameSet) {
      profitObj[stationName] = 0
    }
    let profitValue = partnerProfitMap.get(dateKey)
    for (let value of profitValue) {
      profitObj[value.stationName] = value.profit
    }
    profitData.push(profitObj)
  }
  return {
    stationNameList: Array.from(stationNameSet),
    profitData,
  }
}

const mapDispatchToProps = {
  ...profitAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(ParticipationProfitChart)