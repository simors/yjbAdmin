/**
 * Created by lilu on 2017/10/14.
 */
import AV from 'leancloud-storage'

export async function fetchStationAccounts(payload) {
  try {
    let accounts = await AV.Cloud.run('accountGetStationAccounts', payload)
    return {success: true, accounts: accounts.accountList}
  } catch (error) {
    console.error(error)
    return {success: false, error: error}
  }
}

export async function fetchPartnerAccounts(payload) {
  try {
    let accounts = await AV.Cloud.run('accountGetPartnerAccounts', payload)
    return {success: true, accounts: accounts.accountList}
  } catch (error) {
    console.error(error)
    return {success: false, error: error}
  }
}

export async function fetchInvestorAccounts(payload) {

  try {
    let accounts = await AV.Cloud.run('accountGetInvestorAccounts', payload)
    console.log('accounts=====>',accounts)
    return {success: true, accounts: accounts.accountList}
  } catch (error) {
    console.error(error)
    return {success: false, error: error}
  }
}

export async function fetchStationAccountDetail(payload) {
  try {
    let accounts = undefined
    if(payload.stationId&&payload.stationId!='all'){
       accounts = await AV.Cloud.run('accountGetStationAccountsDetail', payload)
    }else{
       accounts = await AV.Cloud.run('accountGetDayAccountsSum', payload)
    }
    console.log('accounts===~~~~~~~~~~~~~~~~~===>',accounts)
    return {success: true, accounts: accounts}
  } catch (error) {
    console.error(error)
    return {success: false, error: error}
  }
}

export async function fetchPartnerAccountsDetail(payload) {
  try {
    console.log('payload=====>',payload)

    let accounts = await AV.Cloud.run('accountGetPartnerAccountsDetail', payload)
    console.log('accounts===~~~~~~~~~~~~~~~~~===>',accounts)

    return {success: true, accounts: accounts}

  } catch (error) {
    console.error(error)
    return {success: false, error: error}
  }
}

export async function fetchInvestorAccountsDetail(payload) {

  try {
    let accounts = await AV.Cloud.run('accountGetInvestorAccountsDetail', payload)
    return {success: true, accounts: accounts}
  } catch (error) {
    console.error(error)
    return {success: false, error: error}
  }
}