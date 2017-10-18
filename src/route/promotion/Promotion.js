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
import {selector, PromotionStatus} from './redux'
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

  }

  showRowStopModal(record) {

  }

  renderStatusColum = (status) => {
    switch (status) {
      case PromotionStatus.PROMOTION_STATUS_AWAIT:
        return <span>待触发</span>
        break
      case PromotionStatus.PROMOTION_STATUS_UNDERWAY:
        return <span>进行中</span>
        break
      case PromotionStatus.PROMOTION_STATUS_INVALID:
        return <span>无效</span>
        break
      default:
        break
    }
  }

  renderActionColumn = (record) => {
    if(record.status === PromotionStatus.PROMOTION_STATUS_AWAIT) {
      return (
        <span>
          <a style={{color: `blue`}} onClick={() => {this.showRowDetail(record)}}>详情</a>
          <span className="ant-divider" />
          <a style={{color: `blue`}} onClick={() => {this.showRowEditModal(record)}}>编辑</a>
        </span>
      )
    } else if(record.status === PromotionStatus.PROMOTION_STATUS_UNDERWAY) {
      return (
        <span>
          <a style={{color: `blue`}} onClick={() => {this.showRowDetail(record)}}>详情</a>
            <span className="ant-divider" />
            <a style={{color: `blue`}} onClick={() => {this.showRowStatModal(record)}}>统计</a>
            <span className="ant-divider" />
          <a style={{color: `blue`}} onClick={() => {this.showRowStopModal(record)}}>停止</a>
        </span>
      )
    } else if(record.status === PromotionStatus.PROMOTION_STATUS_INVALID) {
      return (
        <span>
          <a style={{color: `blue`}} onClick={() => {this.showRowDetail(record)}}>详情</a>
          <span className="ant-divider" />
          <a style={{color: `blue`}} onClick={() => {this.showRowStatModal(record)}}>统计</a>
        </span>
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
      { title: '活动状态', dataIndex: 'status', key: 'status', render: this.renderStatusColum},
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
        <PromotionEditModal visible={this.state.showPromotionEditModal}
                            promotion={this.state.selectPromotion}
                            onCancel={() => {this.setState({showPromotionEditModal: false})}}/>
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
