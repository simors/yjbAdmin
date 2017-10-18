/**
 * Created by wanpeng on 2017/10/10.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {createPromotionApi, fetchPromotionsApi, fetchPromotionCategoriesApi} from './cloud'
import {action as userActions, selector as userSelector} from '../../util/auth'

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
const FETCH_PROMOTION_CATEGORYLIST = 'FETCH_PROMOTION_CATEGORYLIST'

export const PromotionStatus = {
  PROMOTION_STATUS_AWAIT: 0,
  PROMOTION_STATUS_UNDERWAY: 1,
  PROMOTION_STATUS_INVALID: 2,
}

/**** Action ****/
const updatePromotionList = createAction(UPDATE_PROMOTION_LIST)

export const actions = {
  fetchPromotionsAction: createAction(FETCH_PROMOTIONS),
  savePromotion: createAction(SAVE_PROMOTION),
  savePromotions: createAction(SAVE_PROMOTIONS),
  publishRechargePromotion: createAction(PUBLISH_RECHARGE_PROMOTION),
  savePromotionCategories: createAction(SAVE_PROMOTION_CATEGORIES),
  fetchPromCategoryAction: createAction(FETCH_PROMOTION_CATEGORYLIST),
}

/**** Saga ****/
function* fetchPromotions(action) {
  let payload = action.payload

  let apiPayload = {
    status: payload.status,
    start: payload.start,
    end: payload.end,
  }
  try {
    let promotions = yield call(fetchPromotionsApi, apiPayload)
    yield put(updatePromotionList({ promotions }))
    let users = new Set()
    let categories = new Set()
    promotions.forEach((promotion) => {
      let user = promotion.user
      let category = promotion.category
      if(user) {
        users.add(user)
      }
      if(category) {
        categories.add(category)
      }
    })
    if(users.size > 0) {
      yield put(userActions.saveUsers({ users }))
    }
    if(categories.size > 0) {
      yield put(actions.savePromotionCategories({ categories }))
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

function* fetchPromotionCategories(action) {
  let payload = action.payload

  try {
    let categories = yield call(fetchPromotionCategoriesApi, payload)
    yield put(actions.savePromotionCategories({ categories }))
    if(payload.success) {
      payload.success()
    }
  } catch (error) {
    if(payload.error) {
      payload.error(error)
    }
  }
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
  takeLatest(FETCH_PROMOTION_CATEGORYLIST, fetchPromotionCategories)
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
  let promotionList = List()
  promotions.forEach((promotion) => {
    let promotionRecord = Promotion.fromApi(promotion)
    state = state.setIn(['promotions', promotion.id], promotionRecord)
    promotionList = promotionList.push(promotion.id)
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

  let categoryMap = new Map(incoming.categories)
  try {
    for (let [categoryId, category] of categoryMap) {
      if(categoryId && category) {
        let categoryRecord = new PromotionCategoryRecord({...category})
        state =state.setIn(['categories', categoryId], categoryRecord)
      }
    }
  } catch (error) {

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
  let promotionList = state.PROMOTION.get('promotionList')
  let promotionInfoList = []
  promotionList.toArray().forEach((promotionId) => {
    let promotionInfo = selectPromotion(state, promotionId)
    let categoryInfo = promotionInfo? selectCategory(state, promotionInfo.categoryId) : undefined
    promotionInfo.categoryTitle = categoryInfo? categoryInfo.title: undefined
    let userInfo = promotionInfo? userSelector.selectUserById(state, promotionInfo.userId) : undefined
    promotionInfo.username = userInfo? userInfo.nickname : undefined
    promotionInfoList.push(promotionInfo)
  })

  return promotionInfoList
}

function selectCategory(state, categoryId) {
  if(!categoryId) {
    return undefined
  }
  let categoryRecord = state.PROMOTION.getIn(['categories', categoryId])
  return categoryRecord? categoryRecord.toJS() : undefined
}

function selectCategoryList(state) {
  let categoryMap = state.PROMOTION.get('categories')
  return categoryMap? categoryMap.toJS() : undefined
}

function selectCategoryByTitle(state, title) {
  if(!title) {
    return undefined
  }
  let categoryMap = state.PROMOTION.get('categories')
  let categoryRecord = categoryMap.find((category) => {
    return category.title == title
  })
  return categoryRecord? categoryRecord.toJS() : undefined
}
export const selector = {
  selectPromotion,
  selectPromotionList,
  selectCategory,
  selectCategoryList,
  selectCategoryByTitle,
}
