/**
 * Created by lilu on 2017/9/18.
 */
import AV from 'leancloud-storage'

export async function fetchStations(payload) {
  try {
    // console.log('payload=======>', payload)
    let stations = await AV.Cloud.run('stationFetchStations', payload)
    // console.log('stations=======>', stations)

    return {success: true, stations: stations}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function createStation(payload) {
  try {
    let station = await AV.Cloud.run('stationCreateStation', payload)
    return {success: true, station: station}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function updateStation(payload) {
  try {
    let station = await AV.Cloud.run('stationUpdateStation', payload)
    return {success: true, station: station}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function openStation(payload) {
  try {
    let station = await AV.Cloud.run('stationOpenStation', payload)
    return {success: true, station: station}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function closeStation(payload) {
  try {
    let station = await AV.Cloud.run('stationCloseStation', payload)
    return {success: true, station: station}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function fetchProfitSharing(payload) {
  try {
    let partners = await AV.Cloud.run('stationFetchProfitSharing', payload)
    return {success: true, partners: partners}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function fetchInvestor(payload) {
  try {
    let investors = await AV.Cloud.run('stationFetchInvestor', payload)
    return {success: true, investors: investors}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function openInvestor(payload) {
  try {
    console.log('payload=====>', payload)
    let investors = await AV.Cloud.run('stationOpenInvestor', payload)
    return {success: true, investors: investors}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function closeInvestor(payload) {
  try {
    let investors = await AV.Cloud.run('stationCloseInvestor', payload)
    return {success: true, investors: investors}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function createInvestor(payload) {
  try {
    console.log('payload====>', payload)
    let investors = await AV.Cloud.run('stationCreateInvestor', payload)

    return {success: true, investors: investors}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function updateInvestor(payload) {
  try {
    console.log('payload====>', payload)

    let investors = await AV.Cloud.run('stationUpdateInvestor', payload)
    return {success: true, investors: investors}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function createPartner(payload) {
  try {
    console.log('payload====>', payload)

    let partner = await AV.Cloud.run('stationCreatePartner', payload)
    return {success: true, partner: partner}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function updatePartner(payload) {
  try {
    console.log('payload====>', payload)

    let partner = await AV.Cloud.run('stationUpdatePartner', payload)
    return {success: true, partner: partner}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function openPartner(payload) {
  try {
    console.log('payload====>', payload)

    let partner = await AV.Cloud.run('stationOpenPartner', payload)
    return {success: true, partner: partner}
  } catch (err) {
    return {success: false, error: err}
  }
}

export async function closePartner(payload) {
  try {
    console.log('payload====>', payload)
    let partner = await AV.Cloud.run('stationClosePartner', payload)
    return {success: true, partner: partner}
  } catch (err) {
    return {success: false, error: err}
  }
}
