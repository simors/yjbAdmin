/**
 * Created by wanpeng on 2017/10/10.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {action as userActions, selector as userSelector} from '../../util/auth'
import {createPromotionApi, fetchPromotionsApi, fetchPromotionCategoriesApi, editPromotionApi, fetchRechargePromRecordApi} from './cloud'

/****  Model  ****/
const PromotionRecord = Record({
  id: undefined,                //活动id
  title: undefined,             //活动名称
  start: undefined,             //活动起始时间
  end: undefined,               //活动结束时间
  description: undefined,       //活动描述
  categoryId: undefined,        //活动类型id
  region: undefined,            //活动区域
  disabled: undefined,          //活动状态
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
      record.set('disabled', obj.disabled)
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
  type: undefined,
}, 'PromotionRecord')

const RechargeRecord = Record({
  id: undefined,                //充值活动记录id
  promotionId: undefined,       //充值活动id
  userId: undefined,            //充值用户id
  recharge: undefined,          //充值金额
  award: undefined,             //赠送金额
  createdAt: undefined,         //充值时间

}, 'RechargeRecord')

class Recharge extends RechargeRecord {
  static fromApi(obj) {
    let recharge = new RechargeRecord()
    return recharge.withMutations((record) => {
      record.set('id', obj.id)
      record.set('promotionId', obj.promotionId)
      record.set('userId', obj.userId)
      record.set('recharge', obj.recharge)
      record.set('award', obj.award)
      record.set('createdAt', obj.createdAt)
    })
  }
}

class PromotionCategory extends PromotionCategoryRecord {
  static fromApi(obj) {
    let category = new PromotionCategoryRecord()
    return category.withMutations((record) => {
      record.set('id', obj.id)
      record.set('title', obj.title)
      record.set('description', obj.description)
      record.set('type', obj.type)
    })
  }
}

const PromotionState = Record({
  promotions: Map(),
  promotionList: List(),
  categories: Map(),
  rechargeList: List(),         //充值活动记录id列表
  recharges: Map(),             //充值活动记录
}, 'PromotionState')
/**** Constant ****/
const FETCH_PROMOTIONS = 'FETCH_PROMOTIONS'
const UPDATE_PROMOTION_LIST = 'UPDATE_PROMOTION_LIST'
const SAVE_PROMOTION = 'SAVE_PROMOTION'
const SAVE_PROMOTIONS = 'SAVE_PROMOTIONS'
const PUBLISH_PROMOTION = 'PUBLISH_PROMOTION'
const SAVE_PROMOTION_CATEGORIES = 'SAVE_PROMOTION_CATEGORIES'
const FETCH_PROMOTION_CATEGORYLIST = 'FETCH_PROMOTION_CATEGORYLIST'
const EDIT_PROMOTION = 'EDIT_PROMOTION'
const FETCH_RECHARGE_RECORD = 'FETCH_RECHARGE_RECORD'
const UPDATE_RECHARGE_RECORD_LIST = 'UPDATE_RECHARGE_RECORD_LIST'
const SAVE_RECHARGE_RECORD = 'SAVE_RECHARGE_RECORD'
const SAVE_RECHARGE_RECORDS = 'SAVE_RECHARGE_RECORDS'

export const PromotionCategoryType = {
  PROMOTION_CATEGORY_TYPE_RECHARGE : 1,       //充值奖励
  PROMOTION_CATEGORY_TYPE_SCORE : 2,          //积分活动
  PROMOTION_CATEGORY_TYPE_REDENVELOPE : 3,    //随机红包
}
/**** Action ****/
const updatePromotionList = createAction(UPDATE_PROMOTION_LIST)
const updateRechargeRecordList = createAction(UPDATE_RECHARGE_RECORD_LIST)

export const actions = {
  fetchPromotionsAction: createAction(FETCH_PROMOTIONS),
  savePromotion: createAction(SAVE_PROMOTION),
  savePromotions: createAction(SAVE_PROMOTIONS),
  publishPromotion: createAction(PUBLISH_PROMOTION),
  savePromotionCategories: createAction(SAVE_PROMOTION_CATEGORIES),
  fetchPromCategoryAction: createAction(FETCH_PROMOTION_CATEGORYLIST),
  editPromotion: createAction(EDIT_PROMOTION),
  fetchRechargeRecordAction: createAction(FETCH_RECHARGE_RECORD),
  saveRechargeRecord: createAction(SAVE_RECHARGE_RECORD),
  saveRechargeRecords: createAction(SAVE_RECHARGE_RECORDS),
}

/**** Saga ****/
function* fetchPromotions(action) {
  let payload = action.payload

  let apiPayload = {
    disabled: payload.disabled,
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

function* publishPromotion(action) {
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

function* editPromotion(action) {
  let payload = action.payload

  let apiPayload = {
    promotionId: payload.promotionId,
    title: payload.title,
    start: payload.start,
    end: payload.end,
    description: payload.description,
    region: payload.region,
    awards: payload.awards,
    disabled: payload.disabled,
  }
  try {
    let promotion = yield call(editPromotionApi, apiPayload)
    yield put(actions.savePromotion({ promotion }))

    if(payload.success) {
      payload.success()
    }
  } catch (error) {
    console.error(error)
    console.error("errorCode:", error.code)
    if(payload.error) {
      payload.error(error)
    }
  }
}

function* fetchRechargeRecord(action) {
  let payload = action.payload
  let apiPayload = {
    promotionId: payload.promotionId,
    mobilePhoneNumber: payload.mobilePhoneNumber,
    end: payload.end,
    start: payload.start,
    isRefresh: payload.isRefresh,
    limit: payload.limit,
    lastCreatedAt: payload.lastCreatedAt,
  }
  try {
    let rechargeRecords = yield call(fetchRechargePromRecordApi, apiPayload)
    yield put(updateRechargeRecordList({ rechargeRecords: rechargeRecords, isRefresh: apiPayload.isRefresh }))
    let users = new Set()
    let promotions = new Set()
    rechargeRecords.forEach((rechargeRecord) => {
      let user = rechargeRecord.user
      let promotion = rechargeRecords.promotion
      if(user) {
        users.add(user)
      }
      if(promotion) {
        promotions.add(promotion)
      }
    })
    if(users.size > 0) {
      yield put(userActions.saveUsers({ users }))
    }
    if(promotions.size > 0) {
      yield put(actions.savePromotions({ promotions }))
    }

    if(payload.success) {
      payload.success()
    }
  } catch (error) {
    console.error(error)
    console.error("errorCode:", error.code)
    if(payload.error) {
      payload.error(error)
    }
  }
}

export const saga = [
  takeLatest(FETCH_PROMOTIONS, fetchPromotions),
  takeLatest(PUBLISH_PROMOTION, publishPromotion),
  takeLatest(FETCH_PROMOTION_CATEGORYLIST, fetchPromotionCategories),
  takeLatest(EDIT_PROMOTION, editPromotion),
  takeLatest(FETCH_RECHARGE_RECORD, fetchRechargeRecord),
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
    case UPDATE_RECHARGE_RECORD_LIST:
      return handleUpdateRechargeRecordList(state, action)
    case SAVE_RECHARGE_RECORD:
      return handleSaveRechargeRecord(state, action)
    case SAVE_RECHARGE_RECORDS:
      return handleSaveRechargeRecords(state, action)
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

function handleSaveRechargeRecord(state, action) {
  let rechargeRecord = action.payload.rechargeRecord
  let record = Recharge.fromApi(rechargeRecord)
  state = state.setIn(['recharges', rechargeRecord.id], record)
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

function handleSaveRechargeRecords(state, action) {
  let rechargeRecords = action.payload.rechargeRecords
  rechargeRecords.forEach((rechargeRecord) => {
    let record = Recharge.fromApi(rechargeRecord)
    state = state.setIn(['recharges', rechargeRecord.id], record)
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

function handleUpdateRechargeRecordList(state, action) {
  let rechargeRecords = action.payload.rechargeRecords
  let isRefresh = action.payload.isRefresh

  let rechargeRecordList = List()
  if(!isRefresh) {
    rechargeRecordList = state.get('rechargeList')
  }

  rechargeRecords.forEach((record) => {
    let rechargeRecord = Recharge.fromApi(record)
    state = state.setIn(['recharges', record.id], rechargeRecord)
    console.log("record", record)
    rechargeRecordList = rechargeRecordList.push(record.id)
  })
  state = state.set('rechargeList', rechargeRecordList)
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
    categoryMap.clear()
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

function selectRechargePromRecord(state, rechargeRecordId) {
  if(!rechargeRecordId) {
    return undefined
  }
  let record = state.PROMOTION.getIn(['recharges', rechargeRecordId])
  return record? record.toJS() : undefined
}

function selectRechargePromRecordList(state) {
  let rechargeList = state.PROMOTION.get('rechargeList')
  let rechargeRecordInfolist = []
  rechargeList.toArray().forEach((rechargeRecordId) => {
    let rechargeRecordInfo = selectRechargePromRecord(state, rechargeRecordId)
    let userInfo = rechargeRecordInfo? userSelector.selectUserById(state, rechargeRecordInfo.userId): undefined
    rechargeRecordInfo.mobilePhoneNumber = userInfo? userInfo.mobilePhoneNumber: undefined
    if(rechargeRecordInfo) {
      rechargeRecordInfolist.push(rechargeRecordInfo)
    }
  })
  return rechargeRecordInfolist
}
export const selector = {
  selectPromotion,
  selectPromotionList,
  selectCategory,
  selectCategoryList,
  selectCategoryByTitle,
  selectRechargePromRecordList,
}
