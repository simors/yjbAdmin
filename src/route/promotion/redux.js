/**
 * Created by wanpeng on 2017/10/10.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {action as userActions, selector as userSelector} from '../../util/auth'
import {createPromotionApi, fetchPromotionsApi, fetchPromotionCategoriesApi, editPromotionApi, fetchPromotionRecordApi} from './cloud'

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

const PromotionRDRecord = Record({
  id: undefined,                //活动记录id
  promotionId: undefined,       //活动id
  userId: undefined,            //用户id
  metadata: undefined,          //活动记录数据
  createdAt: undefined,         //活动记录创建时间
}, 'PromotionRecordRecord')

class PromotionRD extends PromotionRDRecord {
  static fromJSON(obj) {
    let promotionRD = new PromotionRDRecord()
    return promotionRD.withMutations((record) => {
      record.set('id', obj.id)
      record.set('promotionId', obj.promotionId)
      record.set('userId', obj.userId)
      record.set('metadata', obj.metadata)
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
  records: Map(),               //活动参与记录
  rechargePromList: List(),     //充值活动记录id列表
  scorePromList: List(),        //积分活动记录id列表
  redEnvelopePromList: List(),  //随机红包记录id列表
  scoreExPromList: List(),      //积分兑换记录id列表
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

const FETCH_PROMOTION_RECORD = 'FETCH_PROMOTION_RECORD'
const UPDATE_PROMOTION_RECORD_LIST = 'UPDATE_PROMOTION_RECORD_LIST'
const SAVE_PROMOTION_RECORD = 'SAVE_PROMOTION_RECORD'
const SAVE_PROMOTION_RECORDS = 'SAVE_PROMOTION_RECORDS'

export const PromotionCategoryType = {
  PROMOTION_CATEGORY_TYPE_RECHARGE : 1,       //充值奖励
  PROMOTION_CATEGORY_TYPE_SCORE : 2,          //积分活动
  PROMOTION_CATEGORY_TYPE_REDENVELOPE : 3,    //随机红包
  PROMOTION_CATEGORY_TYPE_LOTTERY : 4,        //抽奖
  PROMOTION_CATEGORY_TYPE_EXCHANGE_SCORE : 5  //积分兑换
}

export const ScoreType = {
  SCORE_OP_TYPE_FOCUS:      'FOCUS_MP',     //关注微信公众号
  SCORE_OP_TYPE_DEPOSIT:    'DEPOSIT',      //交押金
  SCORE_OP_TYPE_RECHARGE:   'RECHARGE',     //充值
  SCORE_OP_TYPE_SERVICE:    'SERVICE',      //使用干衣柜服务
  SCORE_OP_TYPE_BIND_PHONE: 'BIND_PHONE',   //绑定手机号码
  SCORE_OP_TYPE_ID_AUTH:    'ID_AUTH',      //实名认证
  SCORE_OP_TYPE_EXCHANGE:   'EXCHANGE',     //积分兑换
}
/**** Action ****/
const updatePromotionList = createAction(UPDATE_PROMOTION_LIST)
const updatePromotionRecordList = createAction(UPDATE_PROMOTION_RECORD_LIST)

export const actions = {
  fetchPromotionsAction: createAction(FETCH_PROMOTIONS),
  savePromotion: createAction(SAVE_PROMOTION),
  savePromotions: createAction(SAVE_PROMOTIONS),
  publishPromotion: createAction(PUBLISH_PROMOTION),
  savePromotionCategories: createAction(SAVE_PROMOTION_CATEGORIES),
  fetchPromCategoryAction: createAction(FETCH_PROMOTION_CATEGORYLIST),
  editPromotion: createAction(EDIT_PROMOTION),

  fetchPromotionRecordAction: createAction(FETCH_PROMOTION_RECORD),
  savePromotionRecord: createAction(SAVE_PROMOTION_RECORD),
  savePromotionRecords: createAction(SAVE_PROMOTION_RECORDS),
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

function* fetchPromotionRecord(action) {
  let payload = action.payload
  let apiPayload = {
    promotionId: payload.promotionId,
    mobilePhoneNumber: payload.mobilePhoneNumber,
    end: payload.end,
    start: payload.start,
    isRefresh: payload.isRefresh,
    limit: payload.limit,
    lastCreatedAt: payload.lastCreatedAt
  }

  try {
    let promotionRecords = yield call(fetchPromotionRecordApi, apiPayload)
    yield put(updatePromotionRecordList({
      promotionRecords: promotionRecords,
      isRefresh: apiPayload.isRefresh,
      type: payload.type,
    }))

    let users = new Set()
    let promotions = new Set()
    promotionRecords.forEach((promotionRecord) => {
      let user = promotionRecord.user
      let promotion = promotionRecord.promotion
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
  takeLatest(FETCH_PROMOTION_RECORD, fetchPromotionRecord),
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
    case UPDATE_PROMOTION_RECORD_LIST:
      return handleUpdatePromotionRecordList(state, action)
    case SAVE_PROMOTION_RECORD:
      return
    case SAVE_PROMOTION_RECORDS:
      return
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

function handleUpdatePromotionRecordList(state, action) {
  let promotionRecords = action.payload.promotionRecords
  let isRefresh = action.payload.isRefresh
  let type = action.payload.type

  let promotionRecordList = List()
  switch (type) {
    case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_RECHARGE:
    {
      if(!isRefresh) {
        promotionRecordList = state.get('rechargePromList')
      }
      break
    }
    case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_SCORE:
    {
      if(!isRefresh) {
        promotionRecordList = state.get('scorePromList')
      }
      break
    }
    case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_REDENVELOPE:
    {
      if(!isRefresh) {
        promotionRecordList = state.get('redEnvelopePromList')
      }
      break
    }
    case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_EXCHANGE_SCORE:
    {
      if(!isRefresh) {
        promotionRecordList = state.get('scoreExPromList')
        break
      }
    }
    default:
      break
  }
  promotionRecords.forEach((record) => {
    let promotionRD = PromotionRD.fromJSON(record)
    state = state.setIn(['records', record.id], promotionRD)
    promotionRecordList = promotionRecordList.push(record.id)
  })
  switch (type) {
    case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_RECHARGE:
      state = state.set('rechargePromList', promotionRecordList)
      break
    case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_SCORE:
      state = state.set('scorePromList', promotionRecordList)
      break
    case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_REDENVELOPE:
      state = state.set('redEnvelopePromList', promotionRecordList)
      break
    case PromotionCategoryType.PROMOTION_CATEGORY_TYPE_EXCHANGE_SCORE:
      state = state.set('scoreExPromList', promotionRecordList)
      break
    default:
      break
  }
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
    promotionInfo.categoryType = categoryInfo? categoryInfo.type: undefined
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

function selectCategoryByType(state, type) {
  if(!type) {
    return undefined
  }
  let categoryMap = state.PROMOTION.get('categories')
  let categoryRecord = categoryMap.find((category) => {
    return category.type == type
  })
  return categoryRecord? categoryRecord.toJS() : undefined
}

function selectRecord(state, recordId) {
  if(!recordId) {
    return undefined
  }
  let record = state.PROMOTION.getIn(['records', recordId])
  return record? record.toJS() : undefined
}

function selectRechargePromRecordList(state, promotionId) {
  let rechargePromList = state.PROMOTION.get('rechargePromList')
  let recordList = []
  rechargePromList.toArray().forEach((id) => {
    let recordInfo = selectRecord(state, id)
    let userInfo = recordInfo? userSelector.selectUserById(state, recordInfo.userId) : undefined
    recordInfo.mobilePhoneNumber = userInfo? userInfo.mobilePhoneNumber : undefined
    if(recordInfo && recordInfo.promotionId === promotionId) {
      recordList.push(recordInfo)
    }
  })
  return recordList
}

function selectScorePromRecordList(state, promotionId) {
  let scorePromList = state.PROMOTION.get('scorePromList')
  let recordList = []
  scorePromList.toArray().forEach((id) => {
    let recordInfo = selectRecord(state, id)
    let userInfo = recordInfo? userSelector.selectUserById(state, recordInfo.userId) : undefined
    recordInfo.mobilePhoneNumber = userInfo? userInfo.mobilePhoneNumber : undefined
    if(recordInfo && recordInfo.promotionId === promotionId) {
      recordList.push(recordInfo)
    }
  })
  return recordList
}

function selectRedEnvelopePromRecordList(state, promotionId) {
  let redEnvelopePromList = state.PROMOTION.get('redEnvelopePromList')
  let recordList = []
  redEnvelopePromList.toArray().forEach((id) => {
    let recordInfo = selectRecord(state, id)
    let userInfo = recordInfo? userSelector.selectUserById(state, recordInfo.userId) : undefined
    recordInfo.mobilePhoneNumber = userInfo? userInfo.mobilePhoneNumber : undefined
    if(recordInfo && recordInfo.promotionId === promotionId) {
      recordList.push(recordInfo)
    }
  })
  return recordList
}

function selectScoreExchangePromRecordList(state, promotionId) {
  let scoreExPromList = state.PROMOTION.get('scoreExPromList')
  let recordList = []
  scoreExPromList.toArray().forEach((id) => {
    let recordInfo = selectRecord(state, id)
    let userInfo = recordInfo? userSelector.selectUserById(state, recordInfo.userId) : undefined
    if(recordInfo && recordInfo.promotionId === promotionId) {
      recordList.push(recordInfo)
    }
  })
  return recordList
}

export const selector = {
  selectPromotion,
  selectPromotionList,
  selectCategory,
  selectCategoryList,
  selectCategoryByType,
  selectRechargePromRecordList,
  selectScorePromRecordList,
  selectRedEnvelopePromRecordList,
  selectScoreExchangePromRecordList,
}
