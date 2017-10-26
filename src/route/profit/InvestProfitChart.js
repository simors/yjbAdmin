/**
 * Created by yangyang on 2017/10/19.
 */
import React from 'react'
import {connect} from 'react-redux'
import createG2 from 'g2-react'
import {Stat, Frame} from 'g2'
import { Button, Radio, Icon, Row, Col } from 'antd'
import {profitAction, profitSelector} from './redux'
import {ACCOUNT_TYPE, accountSelector} from '../account'
import {stationSelector} from '../station'

const data = [
  {date: '2017-09-01', '中南大学': 100, '中电软件园': 120},
  {date: '2017-09-02', '中南大学': 110, '中电软件园': 88},
  {date: '2017-09-03', '中南大学': 133, '中电软件园': 97},
  {date: '2017-09-04', '中南大学': 78, '中电软件园': 117},
  {date: '2017-09-05', '中南大学': 122, '中电软件园': 108},
  {date: '2017-09-06', '中南大学': 132, '中电软件园': 89},
  {date: '2017-09-07', '中南大学': 88, '中电软件园': 178},
  {date: '2017-09-08', '中南大学': 67, '中电软件园': 90},
  {date: '2017-09-09', '中南大学': 145, '中电软件园': 123},
  {date: '2017-09-10', '中南大学': 155, '中电软件园': 69},
  {date: '2017-09-11', '中南大学': 78, '中电软件园': 176},
  {date: '2017-09-12', '中南大学': 26, '中电软件园': 67},
]

class InvestProfitChart extends React.PureComponent {
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
    this.props.stat30DaysAccountProfit({accountType: ACCOUNT_TYPE.INVESTOR_ACCOUNT})
  }

  handleStatChange = (e) => {
    console.log('select btn:', e.target.value)
  }

  render() {
    let {stationNameList, profitData} = this.props
    if (!stationNameList || !profitData) {
      return null
    }
    let frame = new Frame(profitData);
    frame = Frame.combineColumns(frame, stationNameList, 'profit', 'stationName', ['date'])
    // frame = Frame.combineColumns(frame, ['中南大学', '中电软件园'], 'profit', 'stationName', ['date'])
    return (
      <div>
        <Row>
          <Col span={8} offset={16}>
            <Radio.Group onChange={this.handleStatChange} defaultValue="30days">
              <Radio.Button value="30days">最近30天</Radio.Button>
              <Radio.Button value="3month">最近3个月</Radio.Button>
              <Radio.Button value="6month">最近半年</Radio.Button>
              <Radio.Button value="1year">最近一年</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        <this.ProfitChart forceFit={true} height={500} width={200} data={frame} plotCfg={{margin: [50, 150, 80, 100]}} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let investProfitList = profitSelector.selectInvestProfitList(state)
  let stationNameSet = new Set()
  let investProfitMap = new Map()
  let profitData = []
  investProfitList.forEach((investProfit) => {
    let accountProfit = accountSelector.selectAccountProfitById(state, investProfit)
    let station = stationSelector.selectStationById(state, accountProfit.stationId)
    stationNameSet.add(station.name)
    let stationProfit = {stationName: station.name, profit: accountProfit.profit}
    let profitMapValue = investProfitMap.get(accountProfit.accountDay)
    if (!profitMapValue) {
      investProfitMap.set(accountProfit.accountDay, [stationProfit])
    } else {
      profitMapValue.push(stationProfit)
      investProfitMap.set(accountProfit.accountDay, profitMapValue)
    }
  })
  for (let dateKey of investProfitMap.keys()) {
    let profitObj = {}
    profitObj.date = dateKey
    for (let stationName of stationNameSet) {
      profitObj[stationName] = 0
    }
    let profitValue = investProfitMap.get(dateKey)
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

export default connect(mapStateToProps, mapDispatchToProps)(InvestProfitChart)