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


export async function fetchSubAreaList(payload) {
  try{
    let defaultPayload = {
      level: "3",
      areaCode: '0-1'
    }
    Object.assign(defaultPayload, payload)
    if(defaultPayload.areaCode.indexOf('-') > -1) {
      defaultPayload.areaType = defaultPayload.areaCode.split('-')[0]
      defaultPayload.areaCode = defaultPayload.areaCode.split('-')[1]
    }
    let results = await AV.Cloud.run('baiduGetSubAreaList2', defaultPayload)
    // console.log('fetchSubAreaList.results====>>>>', results)
    return results
  }catch (err){
    return err
  }
  // console.log('fetchSubAreaList.defaultPayload====>>>>', defaultPayload)
}


// export async function fetchSubAreaList(payload) {
//   try {
//     await sleep(300);
//     return {r: 0, users: [
//       {id: 1, name: '刘德华', phoneNo: '18175181287', note: '暂无'},
//       {id: 2, name: '罗润兵', phoneNo: '18175181288', note: '暂无'},
//       {id: 3, name: '孙燕姿', phoneNo: '18175181289', note: '暂无'},
//       {id: 4, name: '孙燕姿', phoneNo: '18175181289', note: '暂无'},
//       {id: 5, name: '孙燕姿', phoneNo: '18175181289', note: '暂无'},
//       {id: 6, name: '孙燕姿', phoneNo: '18175181289', note: '暂无'},
//       {id: 7, name: '孙燕姿', phoneNo: '18175181289', note: '暂无'},
//       {id: 8, name: '孙燕姿', phoneNo: '18175181289', note: '暂无'},
//       {id: 9, name: '孙燕姿', phoneNo: '18175181289', note: '暂无'},
//       {id: 10, name: '孙燕姿', phoneNo: '18175181289', note: '暂无'},
//       {id: 11, name: '孙燕姿', phoneNo: '18175181289', note: '暂无'},
//       {id: 12, name: '孙燕姿', phoneNo: '18175181289', note: '暂无'},
//     ]};
//   } catch (e) {
//     return {r: -1};
//   }
// }

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