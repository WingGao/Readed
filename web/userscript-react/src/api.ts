// @ts-nocheck
import {buildClient, IBaseRespT, initApi} from "@wingao/readmark-api";
import axios, { AxiosResponse } from "axios";
import {buildStorage, MaybePromise, NotEmptyStorageValue, setupCache, StorageValue} from 'axios-cache-interceptor/dev';
import {GM} from "$";
import {defaultTo} from "lodash-es";
import useAppStore, {AppViewPaths} from "./utils/store";

export async function initApiClient() {
  const client = axios.create({
    // baseURL: await GM.getValue('serverUrl', 'http://localhost:10031'),
    adapter(config) {
      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: config.method,
          url: defaultTo(config.baseURL, '') + config.url,
          headers: config.headers,
          data: config.data,
          responseType: config.responseType as any,
          onload: (res) => {
            let rep = {
              data: res.response,
              status: res.status,
              statusText: res.statusText,
              headers: res.responseHeaders,
              config: config,
            }as any
            // debugger
            resolve(rep )
          },
          onerror: reject
        })
      })
    }
  })
  const cacheKey = 'axios-cache-'
  const gmStore = buildStorage({
    async find(key: string, currentRequest) {
      let c = await GM.getValue(cacheKey + key, null)
      if (c == null) return null
      else return JSON.parse(c)
    }, remove(key: string, currentRequest): MaybePromise<void> {
      GM.deleteValue(cacheKey + key)
    }, set(key: string, value: NotEmptyStorageValue, currentRequest) {
      return GM.setValue(cacheKey + key, JSON.stringify(value))
    }
  })
  client.interceptors.response.use((response) => {
    if (response.status >= 400) {
      if (response.status == 401) { // 未登录
        useAppStore.setState({route:[AppViewPaths.LOGIN]})
      }
      window._ReadMarkApi.notifyApi.error({
        message: 'ApiError',
        description: response.data.Msg,
      })
    }
    return response
  })
  // initApi(import.meta.env.VITE_API_BASE, setupCache(client, {
  //     storage: gmStore,
  //     ttl: 1000 * 60 * 1,
  //     debug: console.log
  // }))
  initApi(import.meta.env.VITE_API_BASE, client)
}

export async function toAntdRep<T,R extends IBaseRespT<T>>(r:T |Promise<T>| R | Promise<R> | Promise<AxiosResponse<R>>):Promise<{success:boolean,data:T}>{
  let rep = r
  let code = 0
  if(r instanceof Promise){
    rep  = await r
  }
  if(rep.data != null) rep = rep.data
  if(rep.Code != null) {
    code = rep.Code
    rep = rep.Data
  }
  return {
    success: code == 0,
    data: rep,
  }
}
