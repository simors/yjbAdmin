/**
 * Created by yangyang on 2017/10/21.
 */
import AV from 'leancloud-storage'

export async function fetchAdminProfit() {
  return await AV.Cloud.run('profitQueryProfit', {})
}

export async function stat30DaysInvestProfit() {
  return await AV.Cloud.run('accountStatLast30DaysPartnerProfit', {})
}