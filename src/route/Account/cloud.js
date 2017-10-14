/**
 * Created by lilu on 2017/10/14.
 */
import AV from 'leancloud-storage'

export async function fetchStationAccounts(payload) {
  try {
    let accounts = await AV.Cloud.run('accountGetStationAccounts', payload)
    return accounts
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function fetchPartnerAccounts(payload) {
  try {
    let accounts = await AV.Cloud.run('accountGetPartnerAccounts', payload)
    return accounts
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function fetchInvestorAccounts(payload) {
  try {
    let accounts = await AV.Cloud.run('accountGetInvestorAccounts', payload)
    return accounts
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function fetchStationAccountDetail(payload) {
  try {
    let accounts = await AV.Cloud.run('accountGetStationAccountsDetail', payload)
    return accounts
  } catch (error) {
    console.error(error)
    throw error
  }
}export async function fetchPartnerAccountsDetail(payload) {
  try {
    let accounts = await AV.Cloud.run('accountGetPartnerAccountsDetail', payload)
    return accounts
  } catch (error) {
    console.error(error)
    throw error
  }
}export async function fetchInvestorAccountsDetail(payload) {
  try {
    let accounts = await AV.Cloud.run('accountGetInvestorAccountsDetail', payload)
    return accounts
  } catch (error) {
    console.error(error)
    throw error
  }
}