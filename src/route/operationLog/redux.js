/**
 * Created by lilu on 2017/10/21.
 */

import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {getOperationList} from './cloud'

import {action as userActions, selector as userSelector} from '../../util/auth'

/****  Model  ****/
const OperationLogRecord = Record({
  id: undefined,                //订单id
  userId: undefined,           //订单编号
  operation: undefined,            //订单状态

}, 'OperationLogRecord')

class OperationLog extends  OperationLogRecord
{
  static fromApi(obj) {
    let operationLog = new OperationLogRecord()
    return operationLog.withMutations((record) => {
      record.set('id', obj.id)
      record.set('userId', obj.userId)
      record.set('operation', obj.operation)
    })
  }
}

const OperationLogState = Record({
  operationLogs: Map(),            //操作日志信息
  operationLogList: List(),            //操作日志List
}, 'OperationLogState')


/**** Constant ****/
const FETCH_OPERATIONS = 'FETCH_OPERATIONS'
const FETCH_OPERATIONS_SUCCESS = 'FETCH_OPERATIONS_SUCCESS'


/**** Action ****/
const fetchOperationListSuccess = createAction(FETCH_OPERATIONS_SUCCESS)

export const actions = {
  fetchOperationList: createAction(FETCH_OPERATIONS),

}
/**** Saga ****/
function* sagaFetchOperationList(action) {
  let payload = action.payload
  let userList = new Set()
  try{
    let operationLogs = yield call(getOperationList,payload)
    if(operationLogs&&operationLogs.length>0){
      operationLogs.forEach((item)=>{
        if(item.user){
          userList.add(item.user)
        }
      })
      yield put(userActions.saveUsers({users:userList}))
      yield put(fetchOperationListSuccess({operationLogs: operationLogs,isRefresh: payload.isRefresh }))
      if(payload.success){
        payload.success()
      }
    }
  }catch(e){
    if(payload.error){
      payload.error(e)
    }
  }

}

export const saga = [
  takeLatest(FETCH_OPERATIONS, sagaFetchOperationList),
]

/**** Reducer ****/
const initialState = OperationLogState()

export function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_OPERATIONS_SUCCESS:
      return handleSetOperationList(state, action)
    default:
      return state
  }
}

function handleSetOperationList(state, action) {
  let operationLogs = action.payload.operationLogs
  let isRefresh = action.payload.isRefresh
  let operationList = List()
  if(!isRefresh) {
    operationList = state.get('operationLogList')
  }
  if(operationLogs&&operationLogs.length>0){
    operationLogs.forEach((item) => {
      let operationRecord = OperationLog.fromApi(item)
      state = state.setIn(['operationLogs', item.id], operationRecord)
      operationList = operationList.push(item.id)
    })
    state = state.set('operationLogList', operationList)
  }
  return state
}

/**** Selector ****/
function selectOperations(state, operationId) {
  if(!operationId) {
    return undefined
  }
  let operationRecord = state.OPERATIONLOG.getIn(['operationLogs', operationId])
  return operationRecord? operationRecord.toJS() : undefined
}

function selectOperationList(state) {
  let operationLogList = state.OPERATIONLOG.get('operationLogList')

  let operationInfoList = []
  operationLogList.toArray().forEach((item) => {
    let operationInfo = selectOperations(state, item)
    let userInfo = operationInfo? userSelector.selectUserById(state, operationInfo.userId) : undefined
    operationInfo.user = userInfo? userInfo: undefined
    operationInfoList.push(operationInfo)
  })
  return operationInfoList
}


export const selector = {
  selectOperationList,
}
