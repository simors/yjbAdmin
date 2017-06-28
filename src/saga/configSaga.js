/**
 * Created by yangyang on 2017/6/28.
 */
import { call, put } from 'redux-saga/effects'
import {fetchDomain, fetchPosition} from '../api/config'
import {requestDomainSuccess, requestPositionSuccess} from '../actions/configActions'
import {Location} from '../models/configModel'

export function* fetchDomainAction(action) {
  let payload = action.payload
  let domain = yield call(fetchDomain, payload)
  yield put(requestDomainSuccess({domain}))
}

export function* fetchPositionAction(action) {
  let payload = action.payload
  let position = yield call(fetchPosition, payload)
  yield put(requestPositionSuccess({location: Location.fromApi(position)}))
}