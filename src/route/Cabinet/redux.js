/**
 * Created by wanpeng on 2017/9/19.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {fetchCabinetsApi, } from './cloud'

/****  Model  ****/
export const CabinetRecord = Record({
  id: undefined,                    //设备id
  deviceNo: undefined,              //设备编号
  status: undefined,                //设备状态
  deviceAddr: undefined,            //设备地址
  stationId: undefined,             //服务网点Id
  stationName: undefined,           //服务网点名称
  onlineTime: undefined,            //上线日期
}, 'CabinetRecord')

export class Cabinet extends CabinetRecord {
  static fromApi(obj) {
    let cabinet = new CabinetRecord()
    return cabinet.withMutations((record) => {
      record.set('id', obj.id)
      record.set('deviceNo', obj.deviceNo)
      record.set('status', obj.status)
      record.set('deviceAddr', obj.deviceAddr)
      record.set('stationId', obj.station.id)
      record.set('stationName', obj.station.name)
      record.set('onlineTime', obj.onlineTime)
    })
  }
}

const CabinetState = Record({
  cabinets: List(),
}, 'CabinetState')

/**** Constant ****/
const FETCH_CABINETS = "FETCH_CABINETS"
const FETCH_CABINETS_SUCCESS = "FETCH_CABINETS_SUCCESS"

export const cabinetStatus = {
  DEVICE_STATUS_IDLE : 0,           //空闲
  DEVICE_STATUS_OCCUPIED : 1,       //使用中
  DEVICE_STATUS_OFFLINE : 2,        //下线
  DEVICE_STATUS_FAULT : 3,          //故障
  DEVICE_STATUS_MAINTAIN : 4,       //维修保养
  DEVICE_STATUS_UNREGISTER : 5,     //未注册
}

/**** Action ****/
export const fetchCabinetsAction = createAction(FETCH_CABINETS)
const fetchCabinetsSuccessAction = createAction(FETCH_CABINETS_SUCCESS)

/**** Saga ****/
function* fetchCabinets(action) {
  let payload = action.payload
  let cabinets = yield call(fetchCabinetsApi, payload)
  let cabinetList = List()
  cabinets.forEach((device) => {
    cabinetList = cabinetList.push(Cabinet.fromApi(device))
  })
  yield put(fetchCabinetsSuccessAction({cabinetList: cabinetList}))
}

export const saga = [
  takeLatest(FETCH_CABINETS, fetchCabinets),
]

/**** Reducer ****/
const initialState = CabinetState()

export function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CABINETS_SUCCESS:
      return handleSaveCabinets(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSaveCabinets(state, action) {
  let cabinetList = action.payload.cabinetList
  state = state.set('cabinets', cabinetList)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.CABINET
  if (!incoming) return state

  let cabinets = incoming.cabinets
  if (cabinets) {
    state = state.set('cabinets', List(cabinets))
  }

  return state
}



/**** Selector ****/
export function selectCabinets(state) {
  let cabinets = state.CABINET.cabinets

  return cabinets.toJS()
}
