/**
 * Created by yangyang on 2017/10/25.
 */
import querystring from 'querystring'
import appConfig from './appConfig'

export function getAuthorizeURL(redirect, state, scope) {
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  var info = {
    appid: appConfig.WECHAT_MP_APPID,
    redirect_uri: redirect,
    response_type: 'code',
    scope: scope || 'snsapi_base',
    state: state || ''
  };
  return url + '?' + querystring.stringify(info) + '#wechat_redirect';
}