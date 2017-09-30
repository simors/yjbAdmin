/**
 * Created by wanpeng on 2017/9/26.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {fetchOrdersApi} from './cloud'
import {deviceActions} from '../device'
import {stationSelector} from '../station/redux'
import {deviceSelector} from '../device'

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
  // nickname: undefined,          //用户昵称
  // mobilePhoneNumber: undefined, //用户手机号码
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
      // record.set('stationId', obj.device.station.id)
      // record.set('stationName', obj.device.station.name)
      record.set('deviceId', obj.device.id)
      // record.set('deviceNo', obj.device.deviceNo)
      record.set('userId', obj.user.id)
      // record.set('nickname', obj.user.nickname)
      // record.set('mobilePhoneNumber', obj.user.mobilePhoneNumber)
    })
  }
}

const OrderState = Record({
  orders: Map(),            //订单信息 健为orderId，值为OrderRecord
  orderList: List()
}, 'OrderState')
/**** Constant ****/
const FETCH_ORDERS = 'FETCH_ORDERS'
const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS'
const UPDATE_ORDER_LIST = 'UPDATE_ORDER_LIST'
const SAVE_ORDER = 'SAVE_ORDER'
const SAVE_ORDERS = 'SAVE_ORDERS'

export const OrderStatus = {
  ORDER_STATUS_UNPAID : 0,      //未支付
  ORDER_STATUS_OCCUPIED : 1,    //使用中
  ORDER_STATUS_PAID : 2,        //已支付
}
/**** Action ****/
const fetchOrdersSuccessAction = createAction(FETCH_ORDERS_SUCCESS)
const updateOrderList = createAction(UPDATE_ORDER_LIST)

export const actions = {
  fetchOrdersAction: createAction(FETCH_ORDERS),
  fetchOrdersSuccessAction,
  saveOrder: createAction(SAVE_ORDER),
  saverOrders: createAction(SAVE_ORDERS)
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
      isRefresh: payload.isRefresh || true,
      lastStartTime: payload.lastStartTime || undefined
    }
    let orders = yield call(fetchOrdersApi, apiPayload)
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
      //TODO 保存station信息
      // yield put()
    }

    if(payload.success) {
      payload.success()
    }
  } catch (error) {
    if(payload.error) {
      payload.error(error)
    }
  }

}
export const saga = [
  takeLatest(FETCH_ORDERS, fetchOrders),
]
/**** Reducer ****/
const initialState = OrderState()

export function reducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_ORDER:
      return handleSaveOrder(state, action)
    case SAVE_ORDERS:
      return handleSaveOrders(state, action)
    case FETCH_ORDERS_SUCCESS:
      return handleSaveOrders(state, action)
    case UPDATE_ORDER_LIST:
      return handleUpdateOrderList(state, action)
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

function handleSaveOrders(state, action) {
  let orders = action.payload.orders

  orders.forEach((order) => {
    let orderRecord = Order.fromApi(order)
    state = state.setIn(['orders', order.id], orderRecord)
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

function onRehydrate(state, action) {
  var incoming = action.payload.ORDER
  if (!incoming) return state

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
    orderInfo.deviceNo = deviceInfo? deviceInfo.deviceNo: undefined
    orderInfo.stationName = stationInfo? stationInfo.name : undefined
    orderInfoList.push(orderInfo)
  })
  return orderInfoList
}

export const selector = {
  selectOrder,
  selectOrderList,
}
