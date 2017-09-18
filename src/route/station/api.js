/**
 * Created by lilu on 2017/9/18.
 */
import AV from 'leancloud-storage'

export async function fetchStations(payload){
  try{
    let stations = AV.Cloud.run('stationFetchStations',payload)
    return stations
  }catch (e){
    return e
  }
}

export async function createStation(payload){
  try{
    let stations = AV.Cloud.run('stationCreateStation',payload)
    return stations
  }catch (e){
    return e
  }
}

export async function updateStation(payload){
  try{
    let stations = AV.Cloud.run('stationUpdateStation',payload)
    return stations
  }catch (e){
    return e
  }
}

export async function openStation(payload){
  try{
    let stations = AV.Cloud.run('stationOpenStation',payload)
    return stations
  }catch (e){
    return e
  }
}

export async function closeStation(payload){
  try{
    let stations = AV.Cloud.run('stationCloseStation',payload)
    return stations
  }catch (e){
    return e
  }
}

export async function fetchProfitSharing(payload){
  try{
    let stations = AV.Cloud.run('stationFetchProfitSharing',payload)
    return stations
  }catch (e){
    return e
  }
}

export async function fetchInvestor(payload){
  try{
    let stations = AV.Cloud.run('stationFetchInvestor',payload)
    return stations
  }catch (e){
    return e
  }
}

export async function createInvestor(payload){
  try{
    let stations = AV.Cloud.run('stationCreateInvestor',payload)
    return stations
  }catch (e){
    return e
  }
}

export async function updateInvestor(payload){
  try{
    let stations = AV.Cloud.run('stationUpdateInvestor',payload)
    return stations
  }catch (e){
    return e
  }
}

