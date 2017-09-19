/**
 * Created by lilu on 2017/9/18.
 */
import AV from 'leancloud-storage'

export async function fetchStations(payload){
  try{
    let stations = await AV.Cloud.run('stationFetchStations',payload)
    return {success: true, stations: stations}
  }catch (err){
    return {success:false, error: err}
  }
}

export async function createStation(payload){
  try{
    let station = await AV.Cloud.run('stationCreateStation',payload)

    return {success: true, station: station}
  }catch (err){
    return {success:false, error: err}
  }
}

export async function updateStation(payload){
  try{
    let stations = await AV.Cloud.run('stationUpdateStation',payload)
    return stations
  }catch (err){
    return {success:false, error: err}
  }
}

export async function openStation(payload){
  try{
    let station = await AV.Cloud.run('stationOpenStation',payload)
    return {success: true, station: station}
  }catch (err){
    return {success:false, error: err}
  }
}

export async function closeStation(payload){
  try{
    let station = await AV.Cloud.run('stationCloseStation',payload)
    return {success: true, station: station}
  }catch (err){
    return {success:false, error: err}
  }
}

export async function fetchProfitSharing(payload){
  try{
    let stations = AV.Cloud.run('stationFetchProfitSharing',payload)
    return stations
  }catch (err){
    return {success:false, error: err}
  }
}

export async function fetchInvestor(payload){
  try{
    let stations = await AV.Cloud.run('stationFetchInvestor',payload)
    return stations
  }catch (err){
    return {success:false, error: err}
  }
}

export async function createInvestor(payload){
  try{
    let stations = await AV.Cloud.run('stationCreateInvestor',payload)
    return stations
  }catch (err){
    return {success:false, error: err}
  }
}

export async function updateInvestor(payload){
  try{
    let stations = await AV.Cloud.run('stationUpdateInvestor',payload)
    return stations
  }catch (err){
    return {success:false, error: err}
  }
}

