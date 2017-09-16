/**
 * Created by yangyang on 2017/9/13.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery } from 'redux-saga/effects'
import {fetchDomain, fetchPosition} from './cloud'

/****  Model  ****/

export const ConfigRecord = Record({
  domain: undefined,
  appname: undefined,
  location: undefined,
}, "ConfigRecord")

export const LocationRecord = Record({
  latitude: undefined,
  longitude: undefined,
  address: undefined,
  country: undefined,
  province: undefined,
  city: undefined,
  district: undefined,
  street: undefined,
  streetNumber: undefined,
}, 'LocationRecord')

export class Location extends LocationRecord {
  static fromApi(obj) {
    let location = new LocationRecord()
    return location.withMutations((record) => {
      record.set('latitude', obj.latitude)
      record.set('longitude', obj.longitude)
      record.set('address', obj.address)
      record.set('country', obj.country)
      record.set('province', obj.province)
      record.set('city', obj.city)
      record.set('district', obj.district)
      record.set('street', obj.street)
      record.set('streetNumber', obj.streetNumber)
    })
  }
}

/**** Constant ****/

const FETCH_DOMAIN = 'FETCH_DOMAIN'
const FETCH_DOMAIN_SUCCESS = 'FETCH_DOMAIN_SUCCESS'
const FETCH_POSITION = 'FETCH_POSITION'
const FETCH_POSITION_SUCCESS = 'FETCH_POSITION_SUCCESS'

/**** Action ****/

export const configAction = {
  requestDomain: createAction(FETCH_DOMAIN),
  requestPosition: createAction(FETCH_POSITION),
}
const requestDomainSuccess = createAction(FETCH_DOMAIN_SUCCESS)
const requestPositionSuccess = createAction(FETCH_POSITION_SUCCESS)

/**** Saga ****/

function* fetchDomainAction(action) {
  let payload = action.payload
  let domain = yield call(fetchDomain, payload)
  yield put(requestDomainSuccess({domain}))
}

function* fetchPositionAction(action) {
  let payload = action.payload
  let position = yield call(fetchPosition, payload)
  yield put(requestPositionSuccess({location: Location.fromApi(position)}))
}

export const configSaga = [
  takeEvery(FETCH_DOMAIN, fetchDomainAction),
  takeEvery(FETCH_POSITION, fetchPositionAction)
]

/**** Reducer ****/

const initialState = ConfigRecord()

export function configReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DOMAIN_SUCCESS:
      return handleSaveDomain(state, action)
    case FETCH_POSITION_SUCCESS:
      return handleSaveLocation(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSaveDomain(state, action) {
  let domain = action.payload.domain
  state = state.set('domain', domain)
  return state
}

function handleSaveLocation(state, action) {
  let location = action.payload.location
  state = state.set('location', location)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.CONFIG
  if (!incoming) return state

  let domain = incoming.domain
  if (domain) {
    state = state.set('domain', domain)
  }

  return state
}

/**** Selector ****/

function selectDomain(state) {
  let config = state.CONFIG
  return config.domain
}

function selectLocation(state) {
  let config = state.CONFIG
  let location = config.location
  if (location) {
    return location.toJS()
  }
  return undefined
}

export const configSelector = {
  selectDomain,
  selectLocation,
}