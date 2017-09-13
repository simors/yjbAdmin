/**
 * Created by yangyang on 2017/6/28.
 */
import { all } from 'redux-saga/effects'
import {configSaga} from '../utils/config'

export default function* rootSaga() {
  yield all([
    ...configSaga,
  ])
}