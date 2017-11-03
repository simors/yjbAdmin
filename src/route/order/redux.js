/**
 * Created by wanpeng on 2017/9/26.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {fetchOrdersApi, fetchRechargesApi, fetchDepositApi} from './cloud'
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

const RechargeRecord = Record({
  id: undefined,                  //充值记录id
  orderNo: undefined,             //充值单号
  userId: undefined,              //充值用户id
  amount: undefined,              //充值金额
  dealTime: undefined,            //充值时间
}, 'RechargeRecord')

class Recharge extends RechargeRecord {
  static fromApi(obj) {
    let recharge = new RechargeRecord()
    return recharge.withMutations((record) => {
      record.set('id', obj.id)
      record.set('orderNo', obj.order_no)
      record.set('userId', obj.userId)
      record.set('amount', obj.cost)
      record.set('dealTime', obj.dealTime)
    })
  }
}

const DepositRecord = Record({
  id: undefined,                  //押金记录id
  orderNo: undefined,             //押金单号
  userId: undefined,              //押金用户id
  amount: undefined,              //押金金额
  dealTime: undefined,            //交易时间
  dealType: undefined,            //交易类型（押金付款&押金退款）
}, 'DepositRecord')

class Deposit extends DepositRecord {
  static fromJSON(obj) {
    let recharge = new DepositRecord()
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

const OrderState = Record({
  orders: Map(),            //订单信息 健为orderId，值为OrderRecord
  orderList: List(),
  recharges: Map(),         //充值记录
  rechargeList: List(),
  deposits: Map(),          //押金记录(支付&退款)
  depositList: List(),
}, 'OrderState')
/**** Constant ****/
const FETCH_ORDERS = 'FETCH_ORDERS'
const UPDATE_ORDER_LIST = 'UPDATE_ORDER_LIST'
const SAVE_ORDER = 'SAVE_ORDER'
const SAVE_ORDERS = 'SAVE_ORDERS'
const FETCH_RECHARGES = 'FETCH_RECHARGES'
const SAVE_RECHARGE = 'SAVE_RECHARGE'
const SAVE_RECHARGES = 'SAVE_RECHARGES'
const UPDATE_RECHARGE_LIST = 'UPDATE_RECHARGE_LIST'
const FETCH_DEPOSIT = 'FETCH_DEPOSIT'
const SAVE_DEPOSIT = 'SAVE_DEPOSIT'
const SAVE_DEPOSITS = 'SAVE_DEPOSITS'
const UPDATE_DEPOSIT_LIST = 'UPDATE_DEPOSIT_LIST'

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
/**** Action ****/
const updateOrderList = createAction(UPDATE_ORDER_LIST)
const updateRechargeList = createAction(UPDATE_RECHARGE_LIST)
const updateDepositList = createAction(UPDATE_DEPOSIT_LIST)

export const actions = {
  fetchOrdersAction: createAction(FETCH_ORDERS),
  saveOrder: createAction(SAVE_ORDER),
  saverOrders: createAction(SAVE_ORDERS),
  saveRecharge: createAction(SAVE_RECHARGE),
  saveRecharges: createAction(SAVE_RECHARGES),
  fetchRechargesAction: createAction(FETCH_RECHARGES),
  fetchDepositAction: createAction(FETCH_DEPOSIT),
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
    console.log("fetchOrdersApi result", result)
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

function* fetchRecharges(action) {
  let payload = action.payload

  let apiPayload = {
    start: payload.start,
    end: payload.end,
    mobilePhoneNumber: payload.mobilePhoneNumber,
    limit: payload.limit,
    isRefresh: payload.isRefresh,
    lastDealTime: payload.lastDealTime || undefined
  }

  try {
    let result = yield call(fetchRechargesApi, apiPayload)
    let recharges = result.rechargeList
    let total = result.total
    yield put(updateRechargeList({recharges: recharges, isRefresh: apiPayload.isRefresh}))
    let users = new Set()
    recharges.forEach((deal) => {
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

function* fetchDeposits(action) {
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
    let result = yield call(fetchDepositApi, apiPayload)
    let deposits = result.depositList
    let total = result.total
    yield put(updateDepositList({deposits: deposits, isRefresh: apiPayload.isRefresh}))
    let users = new Set()
    deposits.forEach((deal) => {
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
export const saga = [
  takeLatest(FETCH_ORDERS, fetchOrders),
  takeLatest(FETCH_RECHARGES, fetchRecharges),
  takeLatest(FETCH_DEPOSIT, fetchDeposits),
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
    case SAVE_RECHARGE:
      return handleSaveRecharge(state, action)
    case SAVE_RECHARGES:
      return handleSaveRecharges(state, action)
    case UPDATE_RECHARGE_LIST:
      return handleUpdateRechargeList(state, action)
    case SAVE_DEPOSIT:
      return handleSaveDeposit(state, action)
    case SAVE_DEPOSITS:
      return handleSaveDeposits(state, action)
    case UPDATE_DEPOSIT_LIST:
      return handleUpdateDepositList(state, action)
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

function handleSaveRecharge(state, action) {
  let recharge = action.payload.recharge
  let rechargeRecord = Recharge.fromApi(recharge)
  state = state.setIn(['recharges', recharge.id], rechargeRecord)
  return state
}

function handleSaveDeposit(state, action) {
  let deposit = action.payload.deposit
  let depositRecord = Deposit.fromJSON(deposit)
  state = state.setIn(['deposits', deposit.id], depositRecord)
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

function handleSaveRecharges(state, action) {
  let recharges = action.payload.recharges

  recharges.forEach((recharge) => {
    let rechargeRecord = Recharge.fromApi(recharge)
    state = state.setIn(['recharges', recharge.id], rechargeRecord)
  })
  return state
}

function handleSaveDeposits(state, action) {
  let deposits = action.payload.deposits
  deposits.forEach((deposit) => {
    let depositRecord = Deposit.fromJSON(deposit)
    state = state.setIn(['deposits', deposit.id], depositRecord)
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

function handleUpdateRechargeList(state, action) {
  let recharges = action.payload.recharges
  let isRefresh = action.payload.isRefresh
  let rechargeList = List()
  if(!isRefresh) {
    rechargeList = state.get('rechargeList')
  }
  recharges.forEach((recharge) => {
    let rechargeRecord = Recharge.fromApi(recharge)
    state = state.setIn(['recharges', recharge.id], rechargeRecord)
    rechargeList = rechargeList.push(recharge.id)
  })
  state = state.set('rechargeList', rechargeList)
  return state
}

function handleUpdateDepositList(state, action) {
  let deposits = action.payload.deposits
  let isRefresh = action.payload.isRefresh
  let depositList = List()
  if(!isRefresh) {
    depositList = state.get('depositList')
  }
  deposits.forEach((deposit) => {
    let depositRecord = Deposit.fromJSON(deposit)
    state = state.setIn(['deposits', deposit.id], depositRecord)
    depositList = depositList.push(deposit.id)
  })
  state = state.set('depositList', depositList)
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

  let rechargeMap = new Map(incoming.recharges)
  try {
    for (let [rechargeId, recharge] of rechargeMap) {
      if(rechargeId && recharge) {
        let rechargeRecord = new RechargeRecord({...recharge})
        state = state.setIn(['recharges', rechargeId], rechargeRecord)
      }
    }
  } catch (error) {
    rechargeMap.clear()
  }

  let rechargeList = incoming.rechargeList
  if(rechargeList) {
    state = state.set('rechargeList', List(rechargeList))
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

function selectRecharge(state, rechargeId) {
  if(!rechargeId) {
    return undefined
  }
  let rechargeRecord = state.ORDER.getIn(['recharges', rechargeId])
  return rechargeRecord? rechargeRecord.toJS() : undefined
}

function selectRechargeList(state) {
  let rechargeList = state.ORDER.get('rechargeList')
  let rechargeInfoList = []

  rechargeList.toArray().forEach((rechargeId) => {
    let rechargeInfo = selectRecharge(state, rechargeId)
    let userInfo = rechargeInfo? userSelector.selectUserById(state, rechargeInfo.userId) : undefined
    rechargeInfo.nickname = userInfo? userInfo.nickname : undefined
    rechargeInfo.mobilePhoneNumber = userInfo? userInfo.mobilePhoneNumber : undefined
    if(rechargeInfo) {
      rechargeInfoList.push(rechargeInfo)
    }
  })
  return rechargeInfoList
}

function selectDeposit(state, depositId) {
  if(!depositId) {
    return undefined
  }
  let depositRecord = state.ORDER.getIn(['deposits', depositId])
  return depositRecord? depositRecord.toJS() : undefined
}

function selectDepositList(state) {
  let depositList = state.ORDER.get('depositList')
  let depositInfoList = []

  depositList.toArray().forEach((depositId) => {
    let depositInfo = selectDeposit(state, depositId)
    let userInfo = depositInfo? userSelector.selectUserById(state, depositInfo.userId) : undefined
    depositInfo.nickname = userInfo? userInfo.nickname : undefined
    depositInfo.mobilePhoneNumber = userInfo? userInfo.mobilePhoneNumber : undefined
    if(depositInfo) {
      depositInfoList.push(depositInfo)
    }
  })
  return depositInfoList
}

export const selector = {
  selectOrder,
  selectOrderList,
  selectRecharge,
  selectRechargeList,
  selectDepositList,
}
