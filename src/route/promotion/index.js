/**
 * Created by wanpeng on 2017/10/10.
 */
import Promotion from './Promotion'
import * as redux from './redux'
import RechargePromotion from './RechargePromotion'

/* export saga */
export const promotionSaga = redux.saga

/* export reducer */
export const promotionReducer = redux.reducer

/* export action */
export const promotionActions = redux.actions

/* export selector */
export const promotionSelector = redux.selector

export default Promotion
export {RechargePromotion}
