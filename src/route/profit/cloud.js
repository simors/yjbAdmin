/**
 * Created by yangyang on 2017/10/21.
 */
import AV from 'leancloud-storage'

export async function fetchAdminProfit() {
  return await AV.Cloud.run('profitQueryProfit', {})
}