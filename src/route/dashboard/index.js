/**
 * Created by yangyang on 2017/10/30.
 */
import Dashboard from './Dashboard'
import * as dashboardRedux from './redux'

export default Dashboard

export const dashboardAction = dashboardRedux.dashboardAction
export const dashboardReducer = dashboardRedux.dashboardReducer
export const dashboardSaga = dashboardRedux.dashboardSaga
export const dashboardSelector = dashboardRedux.dashboardSelector