/**
 * Created by wanpeng on 2017/9/26.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {fetchOrdersApi, fetchDealRecordApi, fetchWithdrawApply, createTransfer} from './cloud'
import {deviceActions} from '../device'
import {stationSelector, stationAction} from '../station/redux'
import {deviceSelector} from '../device'
import {action as userActions, selector as userSelector} from '../../util/auth'

/****  Model  ****/
const OrderRecord = Record({
  id: undefined,                //订单id
  orderNo: undefined,           //订单编号
  status: undefined,            //订单状态
  start: undefined,             //下单时间
  end: undefined,               //结束时间
  amount: undefined,            //订单金额
  deviceId: undefined,          //干衣柜id
  userId: undefined,            //用户id
  createdAt: undefined,
}, 'OrderRecord')

class Order extends OrderRecord {
  static fromApi(obj) {
    let order = new OrderRecord()
    return order.withMutations((record) => {
      record.set('id', obj.id)
      record.set('orderNo', obj.orderNo)
      record.set('status', obj.status)
      record.set('start', obj.createTime)
      record.set('end', obj.endTime)
      record.set('amount', obj.amount)
      record.set('deviceId', obj.device.id)
      record.set('userId', obj.user.id)
      record.set('createdAt', obj.createdAt)
    })
  }
}

const DealRecord = Record({
  id: undefined,                  //押金记录id
  orderNo: undefined,             //押金单号
  userId: undefined,              //押金用户id
  amount: undefined,              //押金金额
  dealTime: undefined,            //交易时间
  dealType: undefined,            //交易类型（押金付款&押金退款）
}, 'DealRecord')

class Deal extends DealRecord {
  static fromJSON(obj) {
    let recharge = new DealRecord()
    return recharge.withMutations((record) => {
      record.set('id', obj.id)
      record.set('orderNo', obj.order_no)
      record.set('userId', obj.userId)
      record.set('amount', obj.cost)
      record.set('dealTime', obj.dealTime)
      record.set('dealType', obj.dealType)
    })
  }
}

class WithdrawApply extends Record({
  id: undefined,
  userId: undefined,
  nickname: undefined,
  mobilePhoneNumber: undefined,
  openid: undefined,
  amount: undefined,
  applyDate: undefined,
  applyType: undefined,
  status: undefined,
  operator: undefined,
  operatorName: undefined,
  operateDate: undefined,
}, 'WithdrawApply') {
  static fromJson(json) {
    let apply = new WithdrawApply()
    return apply.withMutations((record) => {
      record.set('id', json.id)
      record.set('userId', json.userId)
      record.set('nickname', json.nickname)
      record.set('mobilePhoneNumber', json.mobilePhoneNumber)
      record.set('openid', json.openid)
      record.set('amount', json.amount)
      record.set('applyDate', json.applyDate)
      record.set('applyType', json.applyType)
      record.set('status', json.status)
      record.set('operator', json.operator)
      record.set('operatorName', json.operatorName)
      record.set('operateDate', json.operateDate)
    })
  }
}

const OrderState = Record({
  orders: Map(),                  // 订单信息 健为orderId，值为OrderRecord
  orderList: List(),
  deals: Map(),                   // 交易记录
  dealTypeList: Map(),            // 健为交易类型，值为交易记录id列表
  withdrawApplys: Map(),          // 记录WithdrawApply的详情
  withdrawApplyList: List(),      // 取现申请列表
}, 'OrderState')

/**** Constant ****/
const FETCH_ORDERS = 'FETCH_ORDERS'
const UPDATE_ORDER_LIST = 'UPDATE_ORDER_LIST'
const SAVE_ORDER = 'SAVE_ORDER'
const SAVE_ORDERS = 'SAVE_ORDERS'
const SAVE_RECHARGE = 'SAVE_RECHARGE'
const SAVE_RECHARGES = 'SAVE_RECHARGES'
const FETCH_DEALS = 'FETCH_DEALS'
const SAVE_DEAL = 'SAVE_DEAL'
const SAVE_DEALS = 'SAVE_DEALS'
const UPDATE_DEAL_TYPE_LIST = 'UPDATE_DEAL_TYPE_LIST'
const FETCH_WITHDRAW_APPLY = 'FETCH_WITHDRAW_APPLY'
const DELETE_WITHDRAW_APPLY = 'DELETE_WITHDRAW_APPLY'
const SAVE_WITHDRAW_APPLY = 'SAVE_WITHDRAW_APPLY'
const SAVE_BATCH_WITHDRAW_APPLY = 'SAVE_BATCH_WITHDRAW_APPLY'
const SAVE_WITHDRAW_APPLY_LIST = 'SAVE_WITHDRAW_APPLY_LIST'
const REQUEST_WITHDRAW = 'REQUEST_WITHDRAW'

export const OrderStatus = {
  ORDER_STATUS_UNPAID : 0,      //未支付
  ORDER_STATUS_OCCUPIED : 1,    //使用中
  ORDER_STATUS_PAID : 2,        //已支付
}

export const DealType = {
  DEAL_TYPE_DEPOSIT : 1,                // 押金
  DEAL_TYPE_RECHARGE : 2,               // 充值
  DEAL_TYPE_SERVICE : 3,                // 服务消费
  DEAL_TYPE_REFUND : 4,                 // 押金退款
  DEAL_TYPE_WITHDRAW : 5,               // 提现
  DEAL_TYPE_SYS_PRESENT : 6,            // 系统赠送
  DEAL_TYPE_ORDER_PAY : 7,              // 订单支付

}

export const WITHDRAW_STATUS = {
  APPLYING: 1,      // 提交申请
  DONE: 2,          // 处理完成
}

export const WITHDRAW_APPLY_TYPE = {
  REFUND: 1,        // 微信端用户申请退还押金
  PROFIT: 2,        // 服务单位和投资人申请收益取现
}

export const DEAL_TYPE = {
  DEPOSIT: 1,           // 押金
  RECHARGE: 2,          // 充值
  SERVICE: 3,           // 服务消费
  REFUND: 4,            // 押金退款
  WITHDRAW: 5,          // 提现
  SYS_PRESENT: 6,       // 系统赠送
}

/**** Action ****/
const updateOrderList = createAction(UPDATE_ORDER_LIST)
const updateDealTypeList = createAction(UPDATE_DEAL_TYPE_LIST)
const saveWithdrawApply = createAction(SAVE_WITHDRAW_APPLY)
const saveBatchWithdrawApply = createAction(SAVE_BATCH_WITHDRAW_APPLY)
const saveWithdrawApplyList = createAction(SAVE_WITHDRAW_APPLY_LIST)

export const actions = {
  fetchOrdersAction: createAction(FETCH_ORDERS),
  saveOrder: createAction(SAVE_ORDER),
  saverOrders: createAction(SAVE_ORDERS),
  saveDeal: createAction(SAVE_DEAL),
  saveDeals: createAction(SAVE_DEALS),
  fetchDealAction: createAction(FETCH_DEALS),
  fetchWithdrawApply: createAction(FETCH_WITHDRAW_APPLY),
  requestWithdraw: createAction(REQUEST_WITHDRAW),
  deleteWithdrawApply: createAction(DELETE_WITHDRAW_APPLY),
}

/**** Saga ****/
function* fetchOrders(action) {
  let payload = action.payload

  try {
    let apiPayload = {
      start: payload.start,
      end: payload.end,
      status: payload.status,
      mobilePhoneNumber: payload.mobilePhoneNumber,
      stationId: payload.stationId,
      limit: payload.limit,
      isRefresh: payload.isRefresh,
      lastCreatedAt: payload.lastCreatedAt || undefined
    }
    let result = yield call(fetchOrdersApi, apiPayload)
    let orders = result.orderList
    let total = result.total
    yield put(updateOrderList({orders: orders, isRefresh: apiPayload.isRefresh}))
    let devices = new Set()
    let stations = new Set()
    orders.forEach((order) => {
      let device = order.device
      let station = device? device.station : undefined
      if(device) {
        devices.add(device)
      }
      if(station) {
        stations.add(station)
      }
    })
    if(devices.size > 0) {
      yield put(deviceActions.saveDevices({ devices }))
    }
    if(stations.size > 0) {
      yield put(stationAction.saveStations({ stations }))
    }

    if(payload.success) {
      payload.success(total)
    }
  } catch (error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}


function* fetchDealRecord(action) {
  let payload = action.payload
  let apiPayload = {
    start: payload.start,
    end: payload.end,
    mobilePhoneNumber: payload.mobilePhoneNumber,
    limit: payload.limit,
    isRefresh: payload.isRefresh,
    lastDealTime: payload.lastDealTime || undefined,
    dealType: payload.dealType
  }

  try {
    let result = yield call(fetchDealRecordApi, apiPayload)
    let deals = result.dealList
    let total = result.total
    yield put(updateDealTypeList({
      isRefresh: apiPayload.isRefresh,
      dealType: apiPayload.dealType,
      deals: deals}))
    let users = new Set()
    deals.forEach((deal) => {
      let user = deal.user
      if(user) {
        users.add(user)
      }
    })
    if(users.size > 0) {
      yield put(userActions.saveUsers({ users }))
    }
    if(payload.success) {
      payload.success(total)
    }
  } catch (error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

function* sagaFetchWithdrawApply(action) {
  let payload = action.payload
  try {
    let result = yield call(fetchWithdrawApply, payload)
    yield put(saveBatchWithdrawApply({applys: result}))
    yield put(saveWithdrawApplyList({applys: result}))
    if(payload.success) {
      payload.success()
    }
  } catch (error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

function* sagaRequestWithdraw(action) {
  let payload = action.payload

  let transferPayload = {
    amount: payload.amount,
    channel: payload.channel,
    metadata: payload.metadata,
    openid: payload.openid,
    username: payload.username,
  }

  try {
    let transfer = yield call(createTransfer, transferPayload)
    if(payload.success) {
      payload.success(transfer)
    }

  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export const saga = [
  takeLatest(FETCH_ORDERS, fetchOrders),
  takeLatest(FETCH_DEALS, fetchDealRecord),
  takeLatest(FETCH_WITHDRAW_APPLY, sagaFetchWithdrawApply),
  takeLatest(REQUEST_WITHDRAW, sagaRequestWithdraw),
]

/**** Reducer ****/
const initialState = OrderState()

export function reducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_ORDER:
      return handleSaveOrder(state, action)
    case SAVE_ORDERS:
      return handleSaveOrders(state, action)
    case UPDATE_ORDER_LIST:
      return handleUpdateOrderList(state, action)
    case SAVE_DEAL:
      return handleSaveDeal(state, action)
    case SAVE_DEALS:
      return handleSaveDeals(state, action)
    case UPDATE_DEAL_TYPE_LIST:
      return handleUpdateDealTypeList(state, action)
    case SAVE_WITHDRAW_APPLY:
      return handleSaveWithdrawApply(state, action)
    case SAVE_BATCH_WITHDRAW_APPLY:
      return handleSaveBatchWithdrawApply(state, action)
    case SAVE_WITHDRAW_APPLY_LIST:
      return handleSaveWithdrawApplyList(state, action)
    case DELETE_WITHDRAW_APPLY:
      return handleDeleteWithdrawApply(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSaveOrder(state, action) {
  let order = action.payload.order
  let orderRecord = Order.fromApi(order)
  state = state.setIn(['orders', order.id], orderRecord)
  return state
}

function handleSaveDeal(state, action) {
  let deal = action.payload.deal
  let dealRecord = Deal.fromJSON(deal)
  state = state.setIn(['deals', deal.id], dealRecord)
  return state
}

function handleSaveOrders(state, action) {
  let orders = action.payload.orders

  orders.forEach((order) => {
    let orderRecord = Order.fromApi(order)
    state = state.setIn(['orders', order.id], orderRecord)
  })
  return state
}

function handleSaveDeals(state, action) {
  let deals = action.payload.deals

  deals.forEach((deal) => {
    let dealRecord = Deal.fromJSON(deal)
    state = state.setIn(['deals', deal.id], dealRecord)
  })
  return state
}

function handleUpdateOrderList(state, action) {
  let orders = action.payload.orders
  let isRefresh = action.payload.isRefresh
  let orderList = List()
  if(!isRefresh) {
    orderList = state.get('orderList')
  }
  orders.forEach((order) => {
    let orderRecord = Order.fromApi(order)
    state = state.setIn(['orders', order.id], orderRecord)
    orderList = orderList.push(order.id)
  })
  state = state.set('orderList', orderList)
  return state
}

function handleUpdateDealTypeList(state, action) {
  let deals = action.payload.deals
  let isRefresh = action.payload.isRefresh
  let dealType = action.payload.dealType

  let list = []
  if(!isRefresh) {
    list = state.getIn(['dealTypeList', dealType])
  }
  deals.forEach((deal) => {
    let dealRecord = Deal.fromJSON(deal)
    state = state.setIn(['deals', deal.id], dealRecord)
    list.push(deal.id)
  })
  state = state.setIn(['dealTypeList', dealType], list)
  return state
}

function handleSaveWithdrawApply(state, action) {
  let payload = action.payload
  let apply = payload.apply
  state = state.setIn(['withdrawApplys', apply.id], WithdrawApply.fromJson(apply))
  return state
}

function handleSaveBatchWithdrawApply(state, action) {
  let payload = action.payload
  let applys = payload.applys
  applys.forEach((apply) => {
    state = state.setIn(['withdrawApplys', apply.id], WithdrawApply.fromJson(apply))
  })
  return state
}

function handleSaveWithdrawApplyList(state, action) {
  let payload = action.payload
  let applys = payload.applys
  let applyList = []
  applys.forEach((apply) => {
    applyList.push(apply.id)
  })
  state = state.set('withdrawApplyList', new List(applyList))
  return state
}

function handleDeleteWithdrawApply(state, action) {
  let payload = action.payload
  let applyId = payload.applyId
  let applyList = state.get('withdrawApplyList')
  let newList = applyList.filter((v) => v != applyId)
  state = state.set('withdrawApplyList', newList)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.ORDER
  if (!incoming) return state

  let orderMap = new Map(incoming.orders)
  try {
    for (let [orderId, order] of orderMap) {
      if(orderId && order) {
        let orderRecord = new OrderRecord({...order})
        state = state.setIn(['orders', orderId], orderRecord)
      }
    }
  } catch (error) {
    orderMap.clear()
  }

  let orderList = incoming.orderList
  if (orderList) {
    state = state.set('orderList', List(orderList))
  }

  return state
}

/**** Selector ****/
function selectOrder(state, orderId) {
  if(!orderId) {
    return undefined
  }

  let orderRecord = state.ORDER.getIn(['orders', orderId])
  return orderRecord? orderRecord.toJS() : undefined
}

function selectOrderList(state) {
  let orderList = state.ORDER.get('orderList')

  let orderInfoList = []
  orderList.toArray().forEach((orderId) => {
    let orderInfo = selectOrder(state, orderId)
    let deviceInfo = orderInfo? deviceSelector.selectDevice(state, orderInfo.deviceId) : undefined
    let stationInfo = deviceInfo? stationSelector.selectStationById(state, deviceInfo.stationId) : undefined
    let userInfo = orderInfo? userSelector.selectUserById(state, orderInfo.userId) : undefined
    orderInfo.deviceNo = deviceInfo? deviceInfo.deviceNo: undefined
    orderInfo.stationName = stationInfo? stationInfo.name : undefined
    orderInfo.nickname = userInfo? userInfo.nickname : undefined
    orderInfo.mobilePhoneNumber = userInfo? userInfo.mobilePhoneNumber : undefined
    orderInfo.device = deviceInfo
    orderInfoList.push(orderInfo)
  })
  return orderInfoList
}

function selectDealRecord(state, dealId) {
  if(!dealId) {
    return undefined
  }
  let dealRecord = state.ORDER.getIn(['deals', dealId])
  return dealRecord? dealRecord.toJS() : undefined
}

function selectDealRecordList(state, dealType) {
  if(!dealType) {
    return undefined
  }
  let dealInfoList = []
  let dealTypeList = state.ORDER.getIn(['dealTypeList', dealType])
  if(!dealTypeList) {
    return undefined
  }
  dealTypeList.forEach((dealId) => {
    let dealInfo = selectDealRecord(state, dealId)
    let userInfo = dealInfo? userSelector.selectUserById(state, dealInfo.userId) : undefined
    dealInfo.nickname = userInfo? userInfo.nickname : undefined
    dealInfo.mobilePhoneNumber = userInfo? userInfo.mobilePhoneNumber : undefined
    if(dealInfo) {
      dealInfoList.push(dealInfo)
    }
  })
  return dealInfoList
}

function selectWithdrawApplyById(state, id) {
  let apply = state.ORDER.getIn(['withdrawApplys', id])
  if (!apply) {
    return undefined
  }
  return apply.toJS()
}

function selectWithdrawApplyList(state) {
  let applyList = state.ORDER.get('withdrawApplyList')
  if (!applyList) {
    return []
  }
  let retApplys = []
  applyList.forEach((id) => {
    retApplys.push(selectWithdrawApplyById(state, id))
  })
  return retApplys
}

export const selector = {
  selectOrder,
  selectOrderList,
  selectDealRecordList,
  selectWithdrawApplyById,
  selectWithdrawApplyList,
}
