/**
 * Created by lilu on 2017/10/29.
 */

import {call, put, takeLatest} from 'redux-saga/effects';
import {createAction} from 'redux-actions';
import {Record, Map, Set} from 'immutable';

//   Model

class SmsModalRecord extends Record({
  modalVisible: undefined,
  op: undefined,
  verifySuccess: undefined,
  verifyError: undefined,
  closeModal: undefined
}, 'SmsModal') {

}

// --- constant

const UPDATE_SMSMODAL = 'UPDATE_SMSMODAL'
const UPDATE_SMSMODAL_SUCCESS = 'UPDATE_SMSMODAL_SUCCESS'

// --- action

export const smsAction = {
  updateSmsModal: createAction(UPDATE_SMSMODAL)
}

const updateSmsModalSuccess = createAction(UPDATE_SMSMODAL_SUCCESS)

// --- saga

/**控制微信验证窗口打开和关闭
 *
 * @param action
 * payload{
 * modalVisible: bool
 * op: string
 * verifySuccess: func()
 * verifyError: func()
 * }
 */
function* sagaUpdateSmsModal(action) {
  let {modalVisible,op,verifySuccess,verifyError} = action.payload
  let closeModal = put(updateSmsModalSuccess({modalVisible:false,op: undefined}))
  yield put(updateSmsModalSuccess({modalVisible,op,verifySuccess,verifyError,closeModal}))
}

export const smsSaga = [
  takeLatest(UPDATE_SMSMODAL, sagaUpdateSmsModal),
]

// --- reducer

const initialState = new SmsModalRecord()

export function smsReducer(state=initialState, action) {
  switch(action.type) {
    case UPDATE_SMSMODAL_SUCCESS:
      return reduceUpdateSmsModalState(state, action)
    default:
      return state
  }
}

function reduceUpdateSmsModalState(state, action) {
  state = state.set('modalVisible', action.payload.modalVisible)
  state = state.set('op', action.payload.op)
  state = state.set('verifySuccess', action.payload.verifySuccess)
  state = state.set('verifyError', action.payload.verifyError)
  state = state.set('closeModal', action.payload.closeModal)

  return state
}

// --- selector

function selectSmsModalState(state) {
  let payload = {
    modalVisible: state.SMSMODAL.modalVisible,
    op: state.SMSMODAL.op,
    verifySuccess: state.SMSMODAL.verifySuccess,
    verifyError: state.SMSMODAL.verifyError,
    closeModal: state.SMSMODAL.closeModal,

  }
  return payload
}

export const smsSelector = {
  selectSmsModalState,
}