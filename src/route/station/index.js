/**
 * Created by lilu on 2017/10/18.
 */
import StationManage from './StationManage'
import * as redux from './redux'

/* export saga */
export const stationSaga = redux.stationSaga

/* export reducer */
export const stationReducer = redux.stationReducer

/* export action */
export const stationSelector = redux.stationSelector

/* export selector */
export const stationAction = redux.stationAction

export default StationManage

export const PROFIT_SHARE_TYPE = redux.PROFIT_SHARE_TYPE
export const StationStatus = redux.StationStatus