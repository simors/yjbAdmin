/**
 * Created by wanpeng on 2017/9/25.
 */

//LeanCloud环境参数
var LC_APP_ID = ""
var LC_APP_KEY = ""
const LC_DEV_APP_ID = 'QApBtOkMNfNo0lGaHxKBSWXX-gzGzoHsz'      //开发环境
const LC_DEV_APP_KEY = 'znR6wk5JzFU0XIkgKxrM3fnH'
const LC_STAGE_APP_ID = 'HFRm8OUW9tNj2qxz6LuBExBa-gzGzoHsz'    //预上线环境
const LC_STAGE_APP_KEY = 'E9kbn52mW5NL8u15c7Xywf2B'
const LC_PRO_APP_ID = ''                                       //生产环境
const LC_PRO_APP_KEY = ''

if(__DEV__) {          //开发环境
  LC_APP_ID = LC_DEV_APP_ID
  LC_APP_KEY = LC_DEV_APP_KEY

} else if(__STAGE__) { //预上线环境
  LC_APP_ID = LC_STAGE_APP_ID
  LC_APP_KEY = LC_STAGE_APP_KEY

} else if(__PROD__) {   //生产环境
  LC_APP_ID = LC_PRO_APP_ID
  LC_APP_KEY = LC_PRO_APP_KEY
}

var appConfig = {
  APP_NAME: '衣家宝后台管理系统',

  LC_APP_ID: LC_APP_ID,
  LC_APP_KEY: LC_APP_KEY,

}

module.exports = appConfig
