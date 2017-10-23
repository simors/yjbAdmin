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
const LC_PRO_APP_ID = 'HFRm8OUW9tNj2qxz6LuBExBa-gzGzoHsz'      //生产环境
const LC_PRO_APP_KEY = 'E9kbn52mW5NL8u15c7Xywf2B'

//微信
var MP_CLIENT_DOMAIN = "http://yiijiabao.ngrok.io"              //微信公众号客户端域名
const MP_CLIENT_DOMAIN_DEV = "http://yiijiabao.ngrok.io"
const MP_CLIENT_DOMAIN_PRE = "http://dev.yiijiabao.com"
const MP_CLIENT_DOMAIN_PRO = ""


if(__DEV__) {          //开发环境
  LC_APP_ID = LC_DEV_APP_ID
  LC_APP_KEY = LC_DEV_APP_KEY

  MP_CLIENT_DOMAIN = MP_CLIENT_DOMAIN_DEV
} else if(__STAGE__) { //预上线环境
  LC_APP_ID = LC_STAGE_APP_ID
  LC_APP_KEY = LC_STAGE_APP_KEY

  MP_CLIENT_DOMAIN = MP_CLIENT_DOMAIN_PRE
} else if(__PROD__) {   //生产环境
  LC_APP_ID = LC_PRO_APP_ID
  LC_APP_KEY = LC_PRO_APP_KEY

  MP_CLIENT_DOMAIN = MP_CLIENT_DOMAIN_PRO

}

var appConfig = {
  APP_NAME: '衣家宝后台管理系统',

  LC_APP_ID: LC_APP_ID,
  LC_APP_KEY: LC_APP_KEY,

  MP_CLIENT_DOMAIN: MP_CLIENT_DOMAIN,
}

module.exports = appConfig
