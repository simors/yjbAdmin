

import React, {Component, PropTypes} from 'react'
import createG2 from 'g2-react';
import {Stat, Frame} from 'g2';
import {
  Button,
  Tabs,
  Input,
  Modal,
  DatePicker,
  Row,
  Col,
  Menu,
  Dropdown,
  Icon,
  Cascader,
  Select,
  InputNumber,
  Slider
} from 'antd'

const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;
const TabPane = Tabs.TabPane


const orderShowTab = {
  'createTimeDescend': '时间降序',
  'createTimeAscend': '时间升序',

}

export default class AccountChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      area: [],
      months: 0,
      days: 0,
      lastYear: 2017,
      lastMonth: 1,
      // lastDay:0,
      date: new Date(),
      level: 3,
    }
  }

//   this.ProfitChart = createG2(chart => {
//     chart.forceFit();
//     chart.axis('date', {
//       title: {
//         fontSize: '16',
//         textAlign: 'center',
//       },
//     });
//     chart.col('date', {
//       alias: '日期',
//       type: 'time',
//       mask: 'mm-dd',
//       range: [0, 1],
//     })
//     chart.axis('profit', {
//       title: {
//         fontSize: '16',
//         textAlign: 'center',
//       },
//     });
//     chart.col('profit', {
//       alias: '收益（元）',
//     })
//     chart.legend('stationName', {
//       title: null, // 不展示图例 title
//     });
//     chart.line().position('date*profit').color('stationName').shape('stationName', () => 'smooth').size(3);
//     chart.render();
//   })
// }

  renderStatisticsLocal() {


    const LineEarning = createG2(chart => {
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
    });

    let {stationNameList, profitData} = this.props
    if (!stationNameList || !profitData) {
      return null
    }
    let frame = new Frame(profitData);
    frame = Frame.combineColumns(frame, stationNameList, 'profit', 'stationName', ['date'])
    console.log('frame========>',frame)
    return (
      <div>
        <div>
          <LineEarning forceFit={true} height={500} width={200} data={frame} plotCfg={{margin: [50, 150, 80, 100]}} />
        </div>
      </div>
    )


  }

  render() {

    return (

      <div>
        {this.renderStatisticsLocal()}
      </div>

    )
  }
}

