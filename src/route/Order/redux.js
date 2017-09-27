/**
 * Created by wanpeng on 2017/9/26.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import {fetchOrdersApi} from './cloud'

/****  Model  ****/
export const OrderRecord = Record({
  id: undefined,                //订单id
  orderNo: undefined,           //订单编号
  status: undefined,            //订单状态
  start: undefined,             //下单时间
  end: undefined,               //结束时间
  amount: undefined,            //订单金额
  stationId: undefined,         //服务点id
  stationName: undefined,       //服务点名称
  deviceId: undefined,          //干衣柜id
  deviceNo: undefined,          //干衣柜编号
  userId: undefined,            //用户id
  nickname: undefined,          //用户昵称
  mobilePhoneNumber: undefined, //用户手机号码
}, 'OrderRecord')

export class Order extends OrderRecord {
  static fromApi(obj) {
    let order = new OrderRecord()
    return order.withMutations((record) => {
      record.set('id', obj.id)
      record.set('orderNo', obj.orderNo)
      record.set('status', obj.status)
      record.set('start', obj.createTime)
      record.set('end', obj.endTime)
      record.set('amount', obj.amount)
      record.set('stationId', obj.device.station.id)
      record.set('stationName', obj.device.station.name)
      record.set('deviceId', obj.device.id)
      record.set('deviceNo', obj.device.deviceNo)
      record.set('userId', obj.user.id)
      record.set('nickname', obj.user.nickname)
      record.set('mobilePhoneNumber', obj.user.mobilePhoneNumber)
    })
  }
}

const OrderState = Record({
  orderList: List()
}, 'OrderState')
/**** Constant ****/
const FETCH_ORDERS = 'FETCH_ORDERS'
const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS'

export const OrderStatus = {
  ORDER_STATUS_UNPAID : 0,      //未支付
  ORDER_STATUS_OCCUPIED : 1,    //使用中
  ORDER_STATUS_PAID : 2,        //已支付
}
/**** Action ****/
export const fetchOrdersAction = createAction(FETCH_ORDERS)
const fetchOrdersSuccessAction = createAction(FETCH_ORDERS_SUCCESS)
/**** Saga ****/
function* fetchOrders(action) {
  console.log("fetchOrders saga", action)
  let payload = action.payload

  try {
    let orderPayload = {
      start: payload.start,
      end: payload.end,
      status: payload.status,
      mobilePhoneNumber: payload.mobilePhoneNumber,
      stationId: payload.stationId,
      limit: payload.limit,
      isRefresh: payload.isRefresh,
      lastStartTime: payload.lastStartTime || undefined
    }
    let orders = yield call(fetchOrdersApi, orderPayload)
    let orderList = List()
    orders.forEach((order) => {
      orderList = orderList.push(Order.fromApi(order))
    })
    if(payload.success) {
      payload.success()
    }
    yield put(fetchOrdersSuccessAction({orderList: orderList}))
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
    case FETCH_ORDERS_SUCCESS:
      return handleSaveOrders(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSaveOrders(state, action) {
  let orderList = action.payload.orderList
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
export function selectOrders(state) {
  let orderList = state.ORDER.orderList

  return orderList.toJS()
}
