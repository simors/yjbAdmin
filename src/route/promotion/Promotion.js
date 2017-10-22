/**
 * Created by wanpeng on 2017/10/10.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {
  Button,
  Table,
  Row,
} from 'antd'
import moment from "moment"
import style from './promotion.module.scss'
import PromotionSearchForm from './PromotionSearchForm'
import {selector} from './redux'
import PromotionDetailModal from './PromotionDetailModal'
import PromotionEditModal from './PromotionEditModal'

const ButtonGroup = Button.Group

class Promotion extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectPromotion: undefined,
      showPromotionDetailModal: false,
      showPromotionEditModal: false,
    }
  }

  showRowDetail(record) {
    this.setState({
      selectPromotion: record,
      showPromotionDetailModal: true,
    })
  }

  showRowEditModal(record) {
    this.setState({
      selectPromotion: record,
      showPromotionEditModal: true
    })
  }

  showRowStatModal(record) {
    const {history} = this.props
    history.push('/promotion_list/stat', {promotionId: record.id})
  }

  renderStatusColum = (disabled, record) => {
    if(disabled) {
      return <span>禁用</span>
    } else {
      if (moment().isBefore(record.start)) {
        return <span>待触发</span>
      } else if (moment().isSameOrAfter(record.start) && moment().isSameOrBefore(record.end)) {
        return <span>进行中</span>
      } else if (moment().isAfter(record.end)) {
        return <span>结束</span>
      }
    }
  }

  renderActionColumn = (record) => {
    if(moment().isBefore(record.start)) {
      return (
        <span>
            <a style={{color: `blue`}} onClick={() => {this.showRowDetail(record)}}>详情</a>
            <span className="ant-divider" />
            <a style={{color: `blue`}} onClick={() => {this.showRowEditModal(record)}}>编辑</a>
          </span>
      )
    } else if(moment().isSameOrAfter(record.start) && moment().isSameOrBefore(record.end)) {
      return (
        <span>
            <a style={{color: `blue`}} onClick={() => {this.showRowDetail(record)}}>详情</a>
            <span className="ant-divider" />
            <a style={{color: `blue`}} onClick={() => {this.showRowEditModal(record)}}>编辑</a>
            <span className="ant-divider" />
            <a style={{color: `blue`}} onClick={() => {this.showRowStatModal(record)}}>统计</a>
          </span>
      )
    } else if(moment().isAfter(record.end)) {
      return (
        <span>
            <a style={{color: `blue`}} onClick={() => {this.showRowDetail(record)}}>详情</a>
            <span className="ant-divider" />
            <a style={{color: `blue`}} onClick={() => {this.showRowStatModal(record)}}>统计</a>
          </span>
      )
    } else {
      return (
        <span>异常</span>
      )
    }
  }

  render() {
    const columns = [
      { title: '活动类型', dataIndex: 'categoryTitle', key: 'categoryTitle' },
      { title: '活动名称', dataIndex: 'title', key: 'title' },
      { title: '活动开始时间', dataIndex: 'start', key: 'start', render: (start) => (<span>{moment(start).format('LLLL')}</span>)},
      { title: '活动结束时间', dataIndex: 'end', key: 'end', render: (end) => (<span>{moment(end).format('LLLL')}</span>)},
      { title: '发布人', dataIndex: 'username', key: 'username'},
      { title: '活动状态', dataIndex: 'disabled', key: 'disabled', render: this.renderStatusColum},
      { title: '操作', key: 'action', render: this.renderActionColumn}
    ]
    return (
      <div className={style.content}>
        <Row>
          <PromotionSearchForm />
        </Row>
        <Table rowKey="id" columns={columns} dataSource={this.props.promotionList} />
        <PromotionDetailModal visible={this.state.showPromotionDetailModal}
                              onOk={() => {this.setState({showPromotionDetailModal: false})}}
                              onCancel={() => {this.setState({showPromotionDetailModal: false})}}
                              promotion={this.state.selectPromotion}
        />
        {
          this.state.showPromotionEditModal?
            <PromotionEditModal promotion={this.state.selectPromotion} onCancel={() => {this.setState({showPromotionEditModal: false})}}/>
            : null
        }
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
    promotionList: selector.selectPromotionList(appState)
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Promotion))
