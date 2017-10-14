/**
 * Created by wanpeng on 2017/10/10.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {createPromotionApi, fetchPromotionsApi} from './cloud'

/****  Model  ****/
const PromotionRecord = Record({
  id: undefined,                //活动id
  title: undefined,             //活动名称
  start: undefined,             //活动起始时间
  end: undefined,               //活动结束时间
  description: undefined,       //活动描述
  categoryId: undefined,        //活动类型id
  region: undefined,            //活动区域
  status: undefined,            //活动状态
  createdAt: undefined,         //活动创建时间
  awards: undefined,            //活动奖品参数
  userId: undefined,            //活动创建用户id
  stat: undefined,              //活动统计结果
}, 'PromotionRecord')

class Promotion extends PromotionRecord {
  static fromApi(obj) {
    let promotion = new PromotionRecord()
    return promotion.withMutations((record) => {
      record.set('id', obj.id)
      record.set('title', obj.title)
      record.set('start', obj.start)
      record.set('end', obj.end)
      record.set('description', obj.description)
      record.set('categoryId', obj.categoryId)
      record.set('region', obj.region)
      record.set('status', obj.status)
      record.set('createdAt', obj.createdAt)
      record.set('awards', obj.awards)
      record.set('userId', obj.userId)
      record.set('stat', obj.stat)
    })
  }
}

const PromotionCategoryRecord = Record({
  id: undefined,                //活动类型id
  title: undefined,             //活动类型名称
  description: undefined,       //活动类型描述
}, 'PromotionRecord')

class PromotionCategory extends PromotionCategoryRecord {
  static fromApi(obj) {
    let category = new PromotionCategoryRecord()
    return category.withMutations((record) => {
      record.set('id', obj.id)
      record.set('title', obj.title)
      record.set('description', obj.description)
    })
  }
}

const PromotionState = Record({
  promotions: Map(),
  promotionList: List(),
  categories: Map(),
}, 'PromotionState')
/**** Constant ****/
const FETCH_PROMOTIONS = 'FETCH_PROMOTIONS'
const UPDATE_PROMOTION_LIST = 'UPDATE_PROMOTION_LIST'
const SAVE_PROMOTION = 'SAVE_PROMOTION'
const SAVE_PROMOTIONS = 'SAVE_PROMOTIONS'
const PUBLISH_RECHARGE_PROMOTION = 'PUBLISH_RECHARGE_PROMOTION'
const SAVE_PROMOTION_CATEGORIES = 'SAVE_PROMOTION_CATEGORIES'
const FETCH_PROMOTION_CATEGORIES = 'FETCH_PROMOTION_CATEGORIES'

export const PromotionStatus = {


}

/**** Action ****/
const updatePromotionList = createAction(UPDATE_PROMOTION_LIST)

export const actions = {
  fetchPromotionsAction: createAction(FETCH_PROMOTIONS),
  savePromotion: createAction(SAVE_PROMOTION),
  savePromotions: createAction(SAVE_PROMOTIONS),
  publishRechargePromotion: createAction(PUBLISH_RECHARGE_PROMOTION),
  savePromotionCategories: createAction(SAVE_PROMOTION_CATEGORIES),
  fetchPromotionCategories: createAction(FETCH_PROMOTION_CATEGORIES),
}

/**** Saga ****/
function* fetchPromotions(action) {
  let payload = action.payload

}

function* fetchPromotionCategories(action) {
  let payload = action.payload

}

function* publishRechargePromotion(action) {
  let payload = action.payload

  let apiPayload = {
    title: payload.title,
    start: payload.start,
    end: payload.end,
    description: payload.description,
    categoryId: payload.categoryId,
    region: payload.region || [],
    awards: payload.awards,
  }

  try {
    let promotion = yield call(createPromotionApi, apiPayload)
    yield put(actions.savePromotion({ promotion }))
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
  takeLatest(FETCH_PROMOTIONS, fetchPromotions),
  takeLatest(PUBLISH_RECHARGE_PROMOTION, publishRechargePromotion),
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
    case SAVE_PROMOTION_CATEGORIES:
      return handleSavePromotionCategories(state, action)
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

function handleSavePromotionCategories(state, action) {
  let categories = action.payload.categories
  categories.forEach((category) => {
    let categoryRecord = PromotionCategory.fromApi(category)
    state = state.setIn(['categories', category.id], categoryRecord)
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
