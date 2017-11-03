/**
 * Created by lilu on 2017/10/21.
 */
import AV from 'leancloud-storage'

export async function getOperationList(payload) {
  // console.log('payload========>',payload)
  return await AV.Cloud.run('operationFetchOperationLogs', payload)
}

