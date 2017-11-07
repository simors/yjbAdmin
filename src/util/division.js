/**
 * Created by wanpeng on 2017/11/7.
 */
import provinces from 'china-division/dist/provinces.json'
import cities from 'china-division/dist/cities.json'
import areas from 'china-division/dist/areas.json'

/**
 * 通过省市区code获取区域名称
 * @param {Array} region
 * @returns {String} division
 */
export function getDivisionName(region) {
  if(!region || region.length === 0) {
    return undefined
  }
  let division = ""
  provinces.map(province => {
    if(province.code === region[0]) {
      division = division + province.name
    }
  })
  if(region.length > 1) {
    cities.map((city) => {
      if(city.code === region[1] && city.parent_code === region[0]) {
        division = division + city.name
      }
    })
  }

  if(region.length > 2) {
    areas.map((area) => {
      if(area.code === region[2] && area.parent_code === region[1]) {
        division = division + area.name
      }
    })
  }
  return division
}
