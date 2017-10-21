/**
 * Created by yangyang on 2017/10/18.
 */
import Profit from './Profit'
import * as profitRedux from './redux'

export default Profit

export const profitAction = profitRedux.profitAction
export const profitSaga = profitRedux.profitSaga
export const profitReducer = profitRedux.profitReducer
export const profitSelector = profitRedux.profitSelector