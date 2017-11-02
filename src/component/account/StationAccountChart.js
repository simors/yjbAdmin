/**
 * Created by lilu on 2017/10/28.
 */

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

export default class StationAccountChart extends Component {
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



  renderStatisticsLocal() {
    if(this.props.data&&this.props.data.length>0){

      const LineEarning = createG2(chart => {
        chart.axis(this.props.yline, {
          title: {
            fontSize: '16',
            textAlign: 'center',
          }
        });
        chart.tooltip({
          title: null,
          map: {
            value: this.props.yline
          }
        })
        chart.axis(this.props.xline, {
          title: {
            fontSize: '16',
            textAlign: 'center',
          },
        });
        chart.col(this.props.xline, {
          alias: '日期',
          type: 'time',
          mask: 'mm-dd',
          range: [0, 1],
        })
        chart.legend({
          title: null,
          position: 'right',
          itemWrap: true,
        });
        chart.col(this.props.yline,{
          alias: '收益（元）',
        })
        // chart.source(this.props.lastMonthsPerformance,defs)
        chart.line().position(this.props.xline+'*'+this.props.yline).label(this.props.yline).shape('smooth').size(3);
        chart.render();
      });
      return (
        <div>
          <div>
            <LineEarning forceFit={true} data={this.props.data} height={500} width={200} plotCfg={{margin: [50, 150, 80, 100]}} />
          </div>
        </div>
      )
    }else{
      return <div>没有统计数据</div>
    }

  }

  render() {

    return (
      <Tabs defaultActiveKey='1' className='content-inner'>
        <TabPane tab='地区统计' key='2'>
          <div>

            {this.renderStatisticsLocal()}
          </div>
        </TabPane>
      </Tabs>
    )
  }
}






