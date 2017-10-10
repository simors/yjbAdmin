/**
 * Created by yangyang on 2017/9/13.
 */
import AV from 'leancloud-storage'

export function fetchDomain(payload) {
  let times = payload.times
  if (times == 1) {
    return new Promise((resolve) => {
      resolve('xiaojee.cn')
    })
  }
  return new Promise((resolve) => {
    resolve('lvyii.com')
  })
}

export function fetchPosition(payload) {
  return new Promise((resolve) => {
    resolve({
      latitude: 20.23323,
      longitude: 122.34134,
      address: '湖南省长沙市岳麓区麓谷街道',
      country: '中国',
      province: '湖南省',
      city: '长沙市',
      district: '岳麓区',
      street: '麓谷街道',
      streetNumber: 23,
    })
  })
}

export function trim(str){
  if(str&&str.length>0){
    str =  str.replace(/(^\s*)|(\s*$)/g, "")
    // console.log('str',str)

    return str;
  }
}


export function copyArea(obj) {
  let out = [],i = 0,len = obj.length;
  for (; i < len; i++) {
    // console.log('obje=======>',len,obj[i])
    if (obj[i].children){
      out[i] = obj[i]
      out[i].children = copyArea(obj[i].children);
    }
    else out[i] = obj[i];
  }
  return out;
}
