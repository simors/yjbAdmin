/**
 * Created by wanpeng on 2017/10/10.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

/****  Model  ****/
const PromotionRecord = Record({
  id: undefined,

}, 'PromotionRecord')

class Promotion extends PromotionRecord {
  static fromApi(obj) {
    let promotion = new PromotionRecord()
    return promotion.withMutations((record) => {
      record.set('id', obj.id)

    })
  }
}

const PromotionState = Record({
  promotions: Map(),
  promotionList: List(),
}, 'PromotionState')
/**** Constant ****/
const FETCH_PROMOTIONS = 'FETCH_PROMOTIONS'
const UPDATE_PROMOTION_LIST = 'UPDATE_PROMOTION_LIST'
const SAVE_PROMOTION = 'SAVE_PROMOTION'
const SAVE_PROMOTIONS = 'SAVE_PROMOTIONS'

export const PromotionStatus = {


}

/**** Action ****/
const updatePromotionList = createAction(UPDATE_PROMOTION_LIST)

export const actions = {
  fetchPromotionsAction: createAction(FETCH_PROMOTIONS),
  savePromotion: createAction(SAVE_PROMOTION),
  savePromotions: createAction(SAVE_PROMOTIONS),
}
/**** Saga ****/
function* fetchPromotions(action) {
  let payload = action.payload

}

export const saga = [
  takeLatest(FETCH_PROMOTIONS, fetchPromotions),
]
/**** Reducer ****/
const initialState = PromotionState()
export function reducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_PROMOTION:
      return handleSavePromotion(state, action)
    case SAVE_PROMOTIONS:
      return handleSavePromotions(state, action)
    case UPDATE_PROMOTION_LIST:
      return handleUpdatePromotionList(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSavePromotion(state, action) {
  let promotion = action.payload.promotion
  let promotionRecord = Promotion.fromApi(promotion)
  state = state.setIn(['promotions', promotion.id], promotionRecord)
  return state
}

function handleSavePromotions(state, action) {
  let promotions = action.payload.promotions
  promotions.forEach((promotion) => {
    let promotionRecord = Promotion.fromApi(promotion)
    state = state.setIn(['promotions', promotion.id], promotionRecord)
  })
  return state
}

function handleUpdatePromotionList(state, action) {
  let promotions = action.payload.promotions
  let isRefresh = action.payload.isRefresh
  let promotionList = List()
  if(!isRefresh) {
    promotionList = state.get('promotionList')
  }
  promotions.forEach((promotion) => {
    let promotionRecord = Promotion.fromApi(promotion)
    state = state.setIn(['promotions', promotion.id], promotionRecord)
    promotionList.push(promotion.id)
  })
  state = state.set('promotionList', promotionList)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.PROMOTION
  if (!incoming) return state

  let promotionMap = new Map(incoming.promotions)
  try {
    for (let [promotionId, promotion] of promotionMap) {
      if(promotionId && promotion) {
        let promotionRecord = new PromotionRecord({...promotion})
        state = state.setIn(['promotions', promotionId], promotionRecord)
      }
    }
  } catch (error) {
    promotionMap.clear()
  }

  let promotionList = incoming.promotionList
  if(promotionList) {
    state = state.set('promotionList', List(promotionList))
  }

  return state
}
/**** Selector ****/
function selectPromotion(state, promotionId) {
  if(!promotionId) {
    return undefined
  }
  let promotionRecord = state.PROMOTION.getIn(['promotions', promotionId])
  return promotionRecord? promotionRecord.toJS() : undefined
}

function selectPromotionList(state) {

}
export const selector = {
  selectPromotion,
  selectPromotionList,
}
