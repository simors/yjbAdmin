/**
 * Created by yangyang on 2017/6/28.
 */

export function selectDomain(state) {
  let config = state.CONFIG
  return config.domain
}

export function selectLocation(state) {
  let config = state.CONFIG
  let location = config.location
  if (location) {
    return location.toJS()
  }
  return undefined
}