/**
 * Created by wanpeng on 2017/9/30.
 */
import Device from './Device'
import * as redux from './redux'

/* export saga */
export const deviceSaga = redux.saga

/* export reducer */
export const deviceReducer = redux.reducer

/* export action */
export const deviceActions = redux.actions

/* export selector */
export const deviceSelector = redux.selector

export default Device
