/**
 * Created by lilu on 2017/10/21.
 */
import * as redux from './redux'
import OperationLogManager from './OperationLogManager'

/* export saga */
export const operationLogSaga = redux.saga

/* export reducer */
export const operationLogReducer = redux.reducer

/* export action */
export const operationLogActions = redux.actions

/* export selector */
export const operationLogSelector = redux.selector

export default OperationLogManager