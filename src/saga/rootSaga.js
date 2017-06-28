/**
 * Created by yangyang on 2017/6/28.
 */
import * as configActionTypes from '../constants/configActionTypes'
import { fork, takeEvery, take, takeLatest } from 'redux-saga/effects'
import {fetchDomainAction, fetchPositionAction} from './configSaga'

export default function* rootSaga() {
  yield takeEvery(configActionTypes.FETCH_DOMAIN, fetchDomainAction)
  yield takeEvery(configActionTypes.FETCH_POSITION, fetchPositionAction)
}