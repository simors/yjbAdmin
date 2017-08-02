/**
 * Created by yangyang on 2017/6/28.
 */
import {Map, List, Record} from 'immutable'

export const LocationRecord = Record({
  latitude: undefined,
  longitude: undefined,
  address: undefined,
  country: undefined,
  province: undefined,
  city: undefined,
  district: undefined,
  street: undefined,
  streetNumber: undefined,
}, 'LocationRecord')

export const ConfigRecord = Record({
  domain: undefined,
  appname: undefined,
  location: undefined,
}, "ConfigRecord")

export class Location extends LocationRecord {
  static fromApi(obj) {
    let location = new LocationRecord()
    return location.withMutations((record) => {
      record.set('latitude', obj.latitude)
      record.set('longitude', obj.longitude)
      record.set('address', obj.address)
      record.set('country', obj.country)
      record.set('province', obj.province)
      record.set('city', obj.city)
      record.set('district', obj.district)
      record.set('street', obj.street)
      record.set('streetNumber', obj.streetNumber)
    })
  }
}